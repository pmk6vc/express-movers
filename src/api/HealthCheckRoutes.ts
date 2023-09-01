import { eq } from "drizzle-orm";
import express from "express";
import DatabaseClient from "../db/DatabaseClient";
import { dummyUserTableDef } from "../db/model/example/DummyUser";

const router = express.Router();

// TODO: This feels like an easy way to get DB filled up by an attacker - remove once it's no longer a useful example
// TODO: Add testing until router is removed
const healthCheckRouter = (dbClient: DatabaseClient) => {
  return router
    .get("/", (req, res) => {
      res.send("Hello, world!");
    })
    .get("/dummyUsers", async (req, res) => {
      const db = dbClient.pgPoolClient;
      const allUsers = await db.select().from(dummyUserTableDef);
      res.send(allUsers);
    })
    .post("/createDummyUser", async (req, res) => {
      const db = dbClient.pgPoolClient;
      try {
        const newUser = await db
          .insert(dummyUserTableDef)
          .values({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
          })
          .returning();
        res.send(newUser);
      } catch (e) {
        res.status(409).send(`Duplicate email: ${req.body.email}`);
      }
    })
    .delete("/deleteDummyUser", async (req, res) => {
      const db = dbClient.pgPoolClient;
      const deletedUser = await db
        .delete(dummyUserTableDef)
        .where(eq(dummyUserTableDef.id, req.body.id))
        .returning();
      res.send(deletedUser);
    });
};

export default healthCheckRouter;
