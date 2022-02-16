import { MikroORM } from "@mikro-orm/core";
import { __db_connection_string__, __prod__ } from "./constants";
import "reflect-metadata";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.status(200).send("hello world");
  });
  app.listen(3001, () => {
    console.log("server started on localhost:3001");
  });
  // const post = new Post("my second post");
  // await orm.em.persistAndFlush([post]);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

console.log("hello world");
console.log(__db_connection_string__);

main().catch((err) => {
  console.error(err);
});
