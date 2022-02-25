import { MikroORM } from "@mikro-orm/core";
import { __db_connection_string__, __prod__ } from "./constants";
import "reflect-metadata";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import ioredis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  let redisClient = new ioredis();

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        port: 6379,
        logErrors: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: false,
        sameSite: "none",
      },
      saveUninitialized: false,
      secret: "redispassword",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();
  await apolloServer.applyMiddleware({ app, cors: false });

  app.get("/", (_, res) => {
    res.status(200).send("hello world");
  });
  app.listen(3001, () => {
    console.log("server started on http://localhost:3001/graphql");
  });
};

console.log("hello world");
console.log(__db_connection_string__);

main().catch((err) => {
  console.error(err);
});
