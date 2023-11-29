import { eq } from "drizzle-orm";
import express, { Request, Response, Router } from "express";
import { z } from "zod";
import { NewUser, userTableDef } from "../db/model/entity/User";
import { USER_PROPERTY } from "../middleware/AuthenticateUser";
import { GLOBAL_LOG_OBJ } from "../middleware/CorrelatedRequestLogging";
import requireAuthenticatedUser from "../middleware/RequireAuthenticatedUser";
import {
  validateRequestBody,
  validateRequestParams,
} from "../middleware/ValidateRequestData";
import AbstractRouter from "./AbstractRouter";

export default class CustomerRouter extends AbstractRouter {
  private newCustomerRequestSchema = z
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
  private getCustomerRequestSchema = z
    .object({
      customerId: z.string(),
    })
    .strict();

  private newCustomer = async (req: Request, res: Response) => {
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

    // Create new customer
    const parsedRequestBody = this.newCustomerRequestSchema.parse(req.body);
    const newCustomer: NewUser = {
      uid: authenticatedUserRecord.uid,
      email: parsedRequestBody.email,
      profile: parsedRequestBody.profile,
    };
    await this.dbClient.pgPoolClient.insert(userTableDef).values(newCustomer);
    this.logger.info(
      `User ${authenticatedUserRecord.uid} successfully written to database`,
      res.locals[GLOBAL_LOG_OBJ]
    );
    return res
      .status(201)
      .send(`New customer ${authenticatedUserRecord.uid} created`);
  };

  private getCustomer = async (req: Request, res: Response) => {
    const authenticatedUserRecord = res.locals[USER_PROPERTY];
    const parsedRequestParams = this.getCustomerRequestSchema.parse(req.params);
    if (parsedRequestParams.customerId != authenticatedUserRecord.uid) {
      this.logger.info(
        `Authenticated user ${authenticatedUserRecord.uid} does not match requested customer ${parsedRequestParams.customerId}`,
        res.locals[GLOBAL_LOG_OBJ]
      );
      res.status(403).send("Unauthorized request");
      return;
    }
    // TODO: Think about what user data you actually want to expose through this endpoint
    res.status(200).send(authenticatedUserRecord);
  };

  buildRouter(): Router {
    return express
      .Router()
      .post(
        "/",
        requireAuthenticatedUser(this.logger),
        validateRequestBody(this.newCustomerRequestSchema),
        this.newCustomer
      )
      .get(
        "/:customerId",
        requireAuthenticatedUser(this.logger),
        validateRequestParams(this.getCustomerRequestSchema),
        this.getCustomer
      );
  }
}
