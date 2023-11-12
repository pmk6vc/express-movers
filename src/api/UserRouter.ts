import { eq } from "drizzle-orm";
import express, { Request, Response, Router } from "express";
import { Logger } from "winston";
import { z } from "zod";
import DatabaseClient from "../db/DatabaseClient";
import { NewUser, userTableDef } from "../db/model/entity/User";
import { USER_PROPERTY } from "../middleware/AuthenticateUser";
import { GLOBAL_LOG_OBJ } from "../middleware/CorrelatedRequestLogging";
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

  private newUser(dbClient: DatabaseClient, logger: Logger) {
    return async (req: Request, res: Response) => {
      // Confirm that authenticated user has not already been created
      const authenticatedUserRecord = res.locals[USER_PROPERTY];
      const maybeUser = await dbClient.pgPoolClient
        .select()
        .from(userTableDef)
        .where(eq(userTableDef.uid, authenticatedUserRecord.uid));
      if (maybeUser.length > 0) {
        logger.info(
          `User ${authenticatedUserRecord.uid} already exists in database`,
          res.locals[GLOBAL_LOG_OBJ]
        );
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
      logger.info(
        `User ${authenticatedUserRecord.uid} successfully written to database`,
        res.locals[GLOBAL_LOG_OBJ]
      );
      return res
        .status(201)
        .send(`New user ${authenticatedUserRecord.uid} created`);
    };
  }

  private getUser(logger: Logger) {
    return async (req: Request, res: Response) => {
      const authenticatedUserRecord = res.locals[USER_PROPERTY];
      const parsedRequestParams = UserRouter.getUserRequestSchema.parse(
        req.params
      );
      if (parsedRequestParams.userId != authenticatedUserRecord.uid) {
        logger.info(
          `Authenticated user ${authenticatedUserRecord.uid} does not match requested user ${parsedRequestParams.userId}`,
          res.locals[GLOBAL_LOG_OBJ]
        );
        res.status(403).send("Unauthorized request");
        return;
      }
      // TODO: Think about what user data you actually want to expose through this endpoint
      res.status(200).send(authenticatedUserRecord);
    };
  }

  protected buildRouter(dbClient: DatabaseClient, logger: Logger): Router {
    return express
      .Router()
      .post(
        "/newUser",
        requireAuthenticatedUser(logger),
        validateRequestBody(UserRouter.newUserRequestSchema),
        this.newUser(dbClient, logger)
      )
      .get(
        "/:userId",
        requireAuthenticatedUser(logger),
        validateRequestParams(UserRouter.getUserRequestSchema),
        this.getUser(logger)
      );
  }

  static getRouter(dbClient: DatabaseClient, logger: Logger): Router {
    if (!UserRouter.instance) {
      UserRouter.instance = new UserRouter(dbClient, logger);
    }
    return UserRouter.instance.getRouter();
  }
}
