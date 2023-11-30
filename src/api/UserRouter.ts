import { eq } from "drizzle-orm";
import express, { Request, Response, Router } from "express";
import { z } from "zod";
import { PermissionsEnum } from "../db/model/auth/Permissions";
import { NewUser, userTableDef } from "../db/model/entity/User";
import { assertPermissionsOnUser } from "../middleware/AssertPermissionsOnUser";
import { USER_PROPERTY } from "../middleware/AuthenticateUser";
import { GLOBAL_LOG_OBJ } from "../middleware/CorrelatedRequestLogging";
import requireAuthenticatedUser from "../middleware/RequireAuthenticatedUser";
import {
  validateRequestBody,
  validateRequestParams,
} from "../middleware/ValidateRequestData";
import AbstractRouter from "./AbstractRouter";

export default class UserRouter extends AbstractRouter {
  private newUserRequestSchema = z
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
  private getUserRequestSchema = z
    .object({
      userId: z.string(),
    })
    .strict();

  private newUser = async (req: Request, res: Response) => {
    // Confirm that authenticated user has not already been created
    const authenticatedUserRecord = res.locals[USER_PROPERTY];
    const maybeUser = await this.dbClient.pgPoolClient
      .select()
      .from(userTableDef)
      .where(eq(userTableDef.uid, authenticatedUserRecord.uid));
    if (maybeUser.length > 0) {
      this.logger.info(
        `User ${authenticatedUserRecord.uid} already exists in database`,
        res.locals[GLOBAL_LOG_OBJ]
      );
      res.status(409).send("User already exists");
      return;
    }

    // Create new user
    const parsedRequestBody = this.newUserRequestSchema.parse(req.body);
    const newUser: NewUser = {
      uid: authenticatedUserRecord.uid,
      email: parsedRequestBody.email,
      profile: parsedRequestBody.profile,
    };
    await this.dbClient.pgPoolClient.insert(userTableDef).values(newUser);
    this.logger.info(
      `User ${authenticatedUserRecord.uid} successfully written to database`,
      res.locals[GLOBAL_LOG_OBJ]
    );
    return res
      .status(201)
      .send(`New user ${authenticatedUserRecord.uid} created`);
  };

  private getUser = async (req: Request, res: Response) => {
    const authenticatedUserRecord = res.locals[USER_PROPERTY];
    const parsedRequestParams = this.getUserRequestSchema.parse(req.params);
    // if (parsedRequestParams.userId != authenticatedUserRecord.uid) {
    //   this.logger.info(
    //     `Authenticated user ${authenticatedUserRecord.uid} does not match requested user ${parsedRequestParams.userId}`,
    //     res.locals[GLOBAL_LOG_OBJ]
    //   );
    //   res.status(403).send("Unauthorized request");
    //   return;
    // }
    // TODO: Think about what user data you actually want to expose through this endpoint
    res.status(200).send(authenticatedUserRecord);
  };

  buildRouter(): Router {
    return express
      .Router()
      .post(
        "/",
        requireAuthenticatedUser(this.logger),
        validateRequestBody(this.newUserRequestSchema),
        this.newUser
      )
      .get(
        "/:userId",
        requireAuthenticatedUser(this.logger),
        validateRequestParams(this.getUserRequestSchema),
        assertPermissionsOnUser(
          [PermissionsEnum.READ_CUSTOMER],
          this.dbClient,
          this.logger
        ),
        this.getUser
      );
  }
}
