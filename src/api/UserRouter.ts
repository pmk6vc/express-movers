import { eq } from "drizzle-orm";
import express, { Request, Response, Router } from "express";
import { FirebaseError } from "firebase-admin";
import { UserRecord, getAuth } from "firebase-admin/auth";
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
  // TODO: Remove profile information for this endpoint
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
  private writeFirebaseUserToDatabaseSchema = z
    .object({
      uid: z.string(),
    })
    .strict();
  private getUserRequestSchema = z
    .object({
      userId: z.string(),
    })
    .strict();

  private newUser = async (req: Request, res: Response) => {
    // Attempt to create user in Firebase
    const parsedRequestBody = this.newUserRequestSchema.parse(req.body);
    let firebaseUserRecord: UserRecord;
    try {
      // TODO: Add email verification after creation?
      firebaseUserRecord = await getAuth().createUser({
        email: parsedRequestBody.email,
        password: parsedRequestBody.password,
        emailVerified: false,
        displayName: `${parsedRequestBody.profile.firstName} ${parsedRequestBody.profile.lastName}`,
        disabled: false,
      });
      this.logger.info(
        `User with email ${parsedRequestBody.email} created in Firebase with ID ${firebaseUserRecord.uid}`,
        res.locals[GLOBAL_LOG_OBJ],
      );
    } catch (e: unknown) {
      if ((e as FirebaseError).code !== undefined) {
        this.logger.info(
          (e as FirebaseError).message,
          res.locals[GLOBAL_LOG_OBJ],
        );
        res.status(409).send("User already exists");
      } else {
        if (e instanceof Error) {
          this.logger.error(e.message, res.locals[GLOBAL_LOG_OBJ]);
        } else {
          this.logger.error(
            "Something went really wrong :(",
            res.locals[GLOBAL_LOG_OBJ],
          );
        }
        res.status(500).send("Something went wrong :(");
      }
      return;
    }
    return res.status(201).send(`New user ${parsedRequestBody.email} created`);
  };

  private writeFirebaseUserToDatabase = async (req: Request, res: Response) => {
    // TODO: Move endpoint to dedicated service with enforced authentication to avoid public access
    // Kick off I/O concurrently
    const parsedRequestBody = this.writeFirebaseUserToDatabaseSchema.parse(
      req.body,
    );
    const maybeFirebaseUserRecordPromise = getAuth().getUser(
      parsedRequestBody.uid,
    );
    const maybeDatabaseUserRecordPromise = this.dbClient.pgPoolClient
      .select()
      .from(userTableDef)
      .where(eq(userTableDef.uid, parsedRequestBody.uid));

    // Look up Firebase user
    let firebaseUserRecord: UserRecord;
    try {
      firebaseUserRecord = await maybeFirebaseUserRecordPromise;
    } catch (e: unknown) {
      if ((e as FirebaseError).code !== undefined) {
        this.logger.info(
          (e as FirebaseError).message,
          res.locals[GLOBAL_LOG_OBJ],
        );
        res
          .status(409)
          .send(`User ${parsedRequestBody.uid} cannot be found in Firebase`);
      } else {
        if (e instanceof Error) {
          this.logger.error(e.message, res.locals[GLOBAL_LOG_OBJ]);
        } else {
          this.logger.error(
            "Something went really wrong :(",
            res.locals[GLOBAL_LOG_OBJ],
          );
        }
        res.status(500).send("Something went wrong :(");
      }
      return;
    }

    // Confirm that user does not already exist in database
    const maybeDatabaseUserRecord = await maybeDatabaseUserRecordPromise;
    if (maybeDatabaseUserRecord.length > 0) {
      this.logger.info(
        `User ${parsedRequestBody.uid} already exists in database`,
        res.locals[GLOBAL_LOG_OBJ],
      );
      res.status(409).send(`User ${parsedRequestBody.uid} already exists`);
      return;
    }

    // Create new user in database
    const newUserData: NewUser = {
      uid: firebaseUserRecord.uid,
      email: firebaseUserRecord.email!,
    };
    await this.dbClient.pgPoolClient.insert(userTableDef).values(newUserData);
    this.logger.info(
      `User ${firebaseUserRecord.uid} successfully written to database`,
      res.locals[GLOBAL_LOG_OBJ],
    );
    return res.status(201).send(`New user ${firebaseUserRecord.email} created`);
  };

  private updateUserProfile = async (req: Request, res: Response) => {
    res.status(200).send("PINGU");
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
      .post(
        "/writeNewUser",
        validateRequestBody(this.writeFirebaseUserToDatabaseSchema),
        this.writeFirebaseUserToDatabase,
      )
      .patch("/:userId/updateProfile", this.updateUserProfile)
      .get(
        "/:userId",
        requireAuthenticatedUser(this.logger),
        validateRequestParams(this.getUserRequestSchema),
        assertPermissionsOnUser(
          [PermissionsEnum.READ_CUSTOMER],
          this.dbClient,
          this.logger,
        ),
        this.getUser,
      );
  }
}
