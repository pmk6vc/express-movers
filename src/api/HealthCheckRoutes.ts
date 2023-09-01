import express from "express";
import { userTableDef } from "../db/model/example/User";
import DatabaseClient from "../db/DatabaseClient";

const router = express.Router();

const healthCheckRouter = (dbClient: DatabaseClient) => {
  return router
    .get("/", (req, res) => {
      res.send("Hello, world!");
    })
    .get("/users", async (req, res) => {
      const db = dbClient.pgPoolClient;
      const allUsers = await db.select().from(userTableDef);
      res.send(allUsers);
    });
};

export default healthCheckRouter;
