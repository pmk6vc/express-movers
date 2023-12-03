import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { app } from "firebase-admin";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { PermissionsEnum } from "../../../src/db/model/auth/Permissions";
import { Environment } from "../../../src/environment/handlers/IEnvironment";
import { assertPermissionsOnUser } from "../../../src/middleware/AssertPermissionsOnUser";
import { USER_PROPERTY } from "../../../src/middleware/AuthenticateUser";
import {
  DEFAULT_TEST_SUPERUSER,
  DEFAULT_TEST_USER,
} from "../../util/TestConstants";
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
  const mockRequest: Request = {
    body: {},
    params: {},
  } as Request;
  const mockResponse: Response = {
    locals: {},
  } as Response;
  mockResponse.status = jest.fn(() => mockResponse);
  mockResponse.send = jest.fn();
  const nextFunction: NextFunction = jest.fn();

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
    env = setup.env;
    firebaseAdminApp = setup.firebaseAdminApp;
    dbClient = setup.dbClient;
  });

  beforeEach(async () => {
    await setupDefaultUsers(firebaseAdminApp, dbClient);
  });

  afterEach(async () => {
    await tearDownUsers(firebaseAdminApp, dbClient);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, dbClient);
  });

  it("should block request for user with insufficient permissions", async () => {
    // Fetch users
    const [defaultTestUserRecord, defaultTestSuperuserRecord] =
      await Promise.all([
        firebaseAdminApp.auth().getUserByEmail(DEFAULT_TEST_USER.email),
        firebaseAdminApp.auth().getUserByEmail(DEFAULT_TEST_SUPERUSER.email),
      ]);

    // Attempt to read superuser data as default user
    mockResponse.locals[USER_PROPERTY] = defaultTestUserRecord.toJSON();
    mockRequest.params["userId"] = defaultTestSuperuserRecord.uid;
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

  it("should allow request for user with sufficient permissions", async () => {
    // Fetch default user
    const defaultTestUserRecord = await firebaseAdminApp
      .auth()
      .getUserByEmail(DEFAULT_TEST_USER.email);

    // Attempt to read default user data as default user
    mockResponse.locals[USER_PROPERTY] = defaultTestUserRecord.toJSON();
    mockRequest.params["userId"] = defaultTestUserRecord.uid;
    await assertPermissionsOnUser(
      [PermissionsEnum.READ_CUSTOMER],
      dbClient,
      env.logger
    )(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledTimes(0);
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it("should allow user to access any data when no prerequisite permissions are set", async () => {
    // Fetch users
    const [defaultTestUserRecord, defaultTestSuperuserRecord] =
      await Promise.all([
        firebaseAdminApp.auth().getUserByEmail(DEFAULT_TEST_USER.email),
        firebaseAdminApp.auth().getUserByEmail(DEFAULT_TEST_SUPERUSER.email),
      ]);

    // Attempt to read superuser data as default user without setting prerequisite permissions
    mockResponse.locals[USER_PROPERTY] = defaultTestUserRecord.toJSON();
    mockRequest.params["userId"] = defaultTestSuperuserRecord.uid;
    await assertPermissionsOnUser([], dbClient, env.logger)(
      mockRequest,
      mockResponse,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledTimes(0);
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it("should allow superuser to manage any user data", async () => {
    // Fetch users
    const [defaultTestUserRecord, defaultTestSuperuserRecord] =
      await Promise.all([
        firebaseAdminApp.auth().getUserByEmail(DEFAULT_TEST_USER.email),
        firebaseAdminApp.auth().getUserByEmail(DEFAULT_TEST_SUPERUSER.email),
      ]);

    // Attempt to read user data as default superuser
    mockResponse.locals[USER_PROPERTY] = defaultTestSuperuserRecord.toJSON();
    mockRequest.params["userId"] = defaultTestUserRecord.uid;
    await assertPermissionsOnUser(
      [
        PermissionsEnum.CREATE_CUSTOMER,
        PermissionsEnum.READ_CUSTOMER,
        PermissionsEnum.UPDATE_CUSTOMER,
        PermissionsEnum.DELETE_CUSTOMER,
      ],
      dbClient,
      env.logger
    )(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledTimes(0);
    expect(mockResponse.send).toHaveBeenCalledTimes(0);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });
});
