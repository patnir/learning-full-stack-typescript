import { __prod__ } from "./constants";
import { Options } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import path from "path";
import { User } from "./entities/User";

const config: Options = {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  allowGlobalContext: true,
  entities: [Post, User],
  type: "postgresql",
  dbName: "serene_development",
  clientUrl: process.env.DB_CONNECTION_STRING,
  debug: !__prod__,
};

export default config;
