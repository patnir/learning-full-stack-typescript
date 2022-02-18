import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};

export {};

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
