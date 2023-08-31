import express from "express";
import { Environment } from "../environment/handlers/IEnvironment";
import { getDrizzleClientFromEnv } from "../util/DatabaseUtil";
import { userTableDef } from "../model/example/User";

const router = express.Router();

const healthCheckRouter = (env: Environment) => {
  return router
    .get("/", (req, res) => {
      res.send("Hello, world!");
    })
    .get("/users", async (req, res) => {
      const db = await getDrizzleClientFromEnv(env);
      const allUsers = await db.select().from(userTableDef);
      res.send(allUsers);
    });
};

export default healthCheckRouter;
