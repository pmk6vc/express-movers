import { eq } from "drizzle-orm";
import express from "express";
import DatabaseClient from "../db/DatabaseClient";
import { RolesEnum } from "../db/model/auth/Roles";
import { NewUser, userTableDef } from "../db/model/entity/User";
import { USER_PROPERTY } from "../middleware/AuthenticateUser";

const router = express.Router();

const userRouter = (dbClient: DatabaseClient) => {
  return router
    .post("/newCustomer", async (req, res) => {
      // Confirm that request is authenticated
      const authenticatedUserRecord = res.locals[USER_PROPERTY];
      if (!authenticatedUserRecord) {
        res.status(401).send("Unauthenticated request");
        return;
      }
      // Confirm that authenticated user has not already been created
      const maybeUser = await dbClient.pgPoolClient
        .select()
        .from(userTableDef)
        .where(eq(userTableDef.uid, authenticatedUserRecord.uid));
      if (maybeUser) {
        res.status(409).send("User already exists!");
        return;
      }
      // Create new customer
      const newCustomer: NewUser = {
        uid: authenticatedUserRecord.uid,
        roleId: RolesEnum.MOVING_CUSTOMER,
      };
      await dbClient.pgPoolClient.insert(userTableDef).values(newCustomer);
      return res
        .status(201)
        .send(`New customer ${authenticatedUserRecord.uid} created`);
    })
    .get("/:userId", async (req, res) => {
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
