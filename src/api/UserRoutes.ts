import express from "express";
import DatabaseClient from "../db/DatabaseClient";
import { USER_PROPERTY } from "../middleware/AuthenticateUser";

const router = express.Router();

const userRouter = (dbClient: DatabaseClient) => {
  return router.get("/:userId", async (req, res) => {
    const authenticatedUserRecord = res.locals[USER_PROPERTY];
    if (!authenticatedUserRecord) {
      res.status(401).send("Unauthenticated request");
      return;
    }
    if (req.params.userId != authenticatedUserRecord.uid) {
      res.status(403).send("Unauthorized request");
      return;
    }
    res.status(200).send(authenticatedUserRecord);
  });
};

export default userRouter;
