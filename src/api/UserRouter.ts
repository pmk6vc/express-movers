import express, { Request, Response, Router } from "express";
import { getAuth } from "firebase-admin/auth";
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
      password: z.string().min(6),
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
    // Confirm that user with same email has not already been created
    const parsedRequestBody = this.newUserRequestSchema.parse(req.body);
    await getAuth()
      .getUserByEmail(parsedRequestBody.email)
      .then((userRecord) => {
        this.logger.info(
          `User ${userRecord.uid} already exists in Firebase`,
          res.locals[GLOBAL_LOG_OBJ]
        );
        res.status(409).send("User already exists");
        return;
      })
      .catch(() => {
        this.logger.info(
          `No user with email ${parsedRequestBody.email} found in Firebase - proceeding with user creation`,
          res.locals[GLOBAL_LOG_OBJ]
        );
      });

    // Create new user in Firebase and database
    // TODO: Use Pub/Sub for consistency between Firebase and DB
    // TODO: Add email verification?
    const firebaseUserRecord = await getAuth().createUser({
      email: parsedRequestBody.email,
      password: parsedRequestBody.password,
      emailVerified: false,
      displayName: `${parsedRequestBody.profile.firstName} ${parsedRequestBody.profile.lastName}`,
      disabled: false,
    });
    this.logger.info(
      `User with email ${parsedRequestBody.email} created in Firebase with ID ${firebaseUserRecord.uid}`,
      res.locals[GLOBAL_LOG_OBJ]
    );
    const newUser: NewUser = {
      uid: firebaseUserRecord.uid,
      email: parsedRequestBody.email,
      profile: parsedRequestBody.profile,
    };
    await this.dbClient.pgPoolClient.insert(userTableDef).values(newUser);
    this.logger.info(
      `User ${firebaseUserRecord.uid} successfully written to database`,
      res.locals[GLOBAL_LOG_OBJ]
    );
    return res.status(201).send(`New user ${parsedRequestBody.email} created`);
  };

  private getUser = async (req: Request, res: Response) => {
    const authenticatedUserRecord = res.locals[USER_PROPERTY];
    // TODO: Think about what user data you actually want to expose through this endpoint
    res.status(200).send(authenticatedUserRecord);
  };

  buildRouter(): Router {
    return express
      .Router()
      .post("/", validateRequestBody(this.newUserRequestSchema), this.newUser)
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
