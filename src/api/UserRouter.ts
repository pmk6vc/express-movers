import { eq } from "drizzle-orm";
import express, { Request, Response, Router } from "express";
import { z } from "zod";
import DatabaseClient from "../db/DatabaseClient";
import { NewUser, userTableDef } from "../db/model/entity/User";
import { USER_PROPERTY } from "../middleware/AuthenticateUser";
import requireAuthenticatedUser from "../middleware/RequireAuthenticatedUser";
import {
  validateRequestBody,
  validateRequestParams,
} from "../middleware/ValidateRequestData";
import AbstractRouter from "./AbstractRouter";

export default class UserRouter extends AbstractRouter {
  private static instance: UserRouter;
  private static newUserRequestSchema = z
    .object({
      email: z.string().email(),
      profile: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        address: z.string().optional(),
        dateOfBirth: z.coerce.date().optional(),
      }),
    })
    .strict();
  private static getUserRequestSchema = z
    .object({
      userId: z.string(),
    })
    .strict();

  private newUser(dbClient: DatabaseClient) {
    return async (req: Request, res: Response) => {
      // Confirm that authenticated user has not already been created
      const authenticatedUserRecord = res.locals[USER_PROPERTY];
      const maybeUser = await dbClient.pgPoolClient
        .select()
        .from(userTableDef)
        .where(eq(userTableDef.uid, authenticatedUserRecord.uid));
      if (maybeUser.length > 0) {
        res.status(409).send("User already exists");
        return;
      }

      // Create new customer
      const parsedRequestBody = UserRouter.newUserRequestSchema.parse(req.body);
      const newCustomer: NewUser = {
        uid: authenticatedUserRecord.uid,
        email: parsedRequestBody.email,
        profile: parsedRequestBody.profile,
      };
      await dbClient.pgPoolClient.insert(userTableDef).values(newCustomer);
      return res
        .status(201)
        .send(`New user ${authenticatedUserRecord.uid} created`);
    };
  }

  private getUser() {
    return async (req: Request, res: Response) => {
      const authenticatedUserRecord = res.locals[USER_PROPERTY];
      const parsedRequestParams = UserRouter.getUserRequestSchema.parse(
        req.params
      );
      if (parsedRequestParams.userId != authenticatedUserRecord.uid) {
        res.status(403).send("Unauthorized request");
        return;
      }
      res.status(200).send(authenticatedUserRecord);
    };
  }

  protected buildRouter(dbClient: DatabaseClient): Router {
    return express
      .Router()
      .post(
        "/newUser",
        requireAuthenticatedUser,
        validateRequestBody(UserRouter.newUserRequestSchema),
        this.newUser(dbClient)
      )
      .get(
        "/:userId",
        requireAuthenticatedUser,
        validateRequestParams(UserRouter.getUserRequestSchema),
        this.getUser()
      );
  }

  static getRouter(dbClient: DatabaseClient): Router {
    if (!UserRouter.instance) {
      UserRouter.instance = new UserRouter(dbClient);
    }
    return UserRouter.instance.getRouter();
  }
}
