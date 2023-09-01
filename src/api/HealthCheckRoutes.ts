import express from "express";
import DatabaseClient from "../db/DatabaseClient";
import { userTableDef } from "../db/model/example/User";

const router = express.Router();

const healthCheckRouter = (dbClient: DatabaseClient) => {
  return (
    router
      .get("/", (req, res) => {
        res.send("Hello, world!");
      })
      // TODO: Change this endpoint to something meaningful (or get rid of it)
      .get("/users", async (req, res) => {
        const db = dbClient.pgPoolClient;
        const allUsers = await db.select().from(userTableDef);
        res.send(allUsers);
      })
  );
};

export default healthCheckRouter;
