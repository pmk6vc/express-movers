import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "@jest/globals";
import { Express, NextFunction, Request, Response } from "express";
import { app } from "firebase-admin";
import request from "supertest";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { PermissionsEnum } from "../../../src/db/model/auth/Permissions";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { Environment } from "../../../src/environment/handlers/IEnvironment";
import { assertPermissionsOnUser } from "../../../src/middleware/AssertPermissionsOnUser";
import { USER_PROPERTY } from "../../../src/middleware/AuthenticateUser";
import { TEST_USER_ONE, TEST_USER_TWO } from "../../util/TestConstants";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupDefaultUsers,
  setupIntegrationTest,
  tearDownIntegrationTest,
  tearDownUsers,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("user permissions middleware should work", () => {
  let env: Environment;
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
  let expressApp: Express;
  let testUsers: ITestUser[];
  let mockRequest: Request;
  const nextFunction: NextFunction = jest.fn();
  let mockResponse: Response;

  beforeAll(async () => {
    env = await EnvironmentFactory.getHandler().getEnvironment();
    const setup = await setupIntegrationTest();
    firebaseAdminApp = setup.firebaseAdminApp;
    dbClient = setup.dbClient;
    expressApp = setup.expressApp;
  });

  beforeEach(async () => {
    mockRequest = {
      body: {},
      params: {},
    } as Request;
    mockResponse = {
      locals: {},
    } as Response;
    mockResponse.status = jest.fn(() => mockResponse);
    mockResponse.send = jest.fn();
    testUsers = await setupDefaultUsers(firebaseAdminApp, dbClient);
  });

  afterEach(async () => {
    await tearDownUsers(firebaseAdminApp, dbClient);
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, dbClient);
  });

  it("should block request for user with insufficient permissions", async () => {
    // Create regular users
    await Promise.all([
      request(expressApp).post("/users").send(TEST_USER_ONE),
      request(expressApp).post("/users").send(TEST_USER_TWO),
    ]);

    // Try to access other user data
    const [userOneRecord, userTwoRecord] = await Promise.all([
      firebaseAdminApp.auth().getUserByEmail(TEST_USER_ONE.email),
      firebaseAdminApp.auth().getUserByEmail(TEST_USER_TWO.email),
    ]);
    mockResponse.locals[USER_PROPERTY] = userOneRecord.toJSON();
    mockRequest.params["userId"] = userTwoRecord.uid;
    await assertPermissionsOnUser(
      [PermissionsEnum.READ_CUSTOMER],
      dbClient,
      env.logger
    )(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });

  // it("should allow user to access any data when no prerequisite permissions are set", async () => {});
  //
  // it("should allow user to access their own data with customer permission prerequisites", async () => {});
  //
  // it("should allow superuser to access any data", async () => {});
});
