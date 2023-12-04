import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
} from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { userTableDef } from "../../../src/db/model/entity/User";
import { Environment } from "../../../src/environment/handlers/IEnvironment";
import authenticateUser, {
  USER_PROPERTY,
} from "../../../src/middleware/AuthenticateUser";
import {
  TABLES_TO_TRUNCATE,
  TEST_USER_ONE,
  TEST_USER_TWO,
} from "../../util/TestConstants";
import { truncateTables } from "../../util/TestDatabaseUtil";
import { getIdTokenWithEmailPassword } from "../../util/integration/FirebaseEmulatorsUtil";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("authentication middleware should work", () => {
  let env: Environment;
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
  let testUsers: ITestUser[];
  const mockRequest: Request = {
    headers: {},
  } as Request;
  const mockResponse: Response = {
    locals: {},
  } as Response;
  mockResponse.status = jest.fn(() => mockResponse);
  mockResponse.send = jest.fn();
  const nextFunction: NextFunction = jest.fn();

  async function setupUsers(): Promise<ITestUser[]> {
    const userRecord = await getAuth(firebaseAdminApp).createUser(
      TEST_USER_ONE
    );
    await dbClient.pgPoolClient.insert(userTableDef).values({
      uid: userRecord.uid,
      email: TEST_USER_ONE.email,
      profile: TEST_USER_ONE.profile,
    });
    return [
      {
        userRecord: userRecord,
        userCredentials: {
          email: TEST_USER_ONE.email,
          password: TEST_USER_ONE.password,
        },
        profile: TEST_USER_ONE.profile,
      },
    ];
  }

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
    firebaseAdminApp = setup.firebaseAdminApp;
    env = setup.env;
    dbClient = setup.dbClient;
  });

  beforeEach(async () => {
    testUsers = await setupUsers();
  });

  afterEach(async () => {
    const firebaseUsers = (await getAuth(firebaseAdminApp).listUsers()).users;
    await Promise.all([
      getAuth(firebaseAdminApp).deleteUsers(firebaseUsers.map((u) => u.uid)),
      truncateTables(dbClient, TABLES_TO_TRUNCATE),
    ]);
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, dbClient);
  });

  it("should not assign user if bearer token is missing", async () => {
    await authenticateUser(dbClient, env.logger)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.locals[USER_PROPERTY]).toBe(undefined);
    expect(nextFunction).toBeCalledTimes(1);
  });

  it("should not assign user if bearer token is invalid", async () => {
    mockRequest.headers = {
      authorization: "Bearer Invalid token",
    };
    await authenticateUser(dbClient, env.logger)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.locals[USER_PROPERTY]).toBe(undefined);
    expect(nextFunction).toBeCalledTimes(1);
  });

  it("should return server error if user exists in Firebase but not database", async () => {
    // Create user only in Firebase
    await getAuth(firebaseAdminApp).createUser(TEST_USER_TWO);
    const bearerToken = await getIdTokenWithEmailPassword(
      TEST_USER_TWO.email,
      TEST_USER_TWO.password
    );
    mockRequest.headers = {
      authorization: `Bearer ${bearerToken}`,
    };
    await authenticateUser(dbClient, env.logger)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Confirm server error in response
    expect(mockResponse.locals[USER_PROPERTY]).toBe(undefined);
    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
    expect(nextFunction).toBeCalledTimes(0);
  });

  it("should assign user if valid bearer token is passed", async () => {
    const testUser = testUsers[0];
    const bearerToken = await getIdTokenWithEmailPassword(
      testUser.userCredentials.email,
      testUser.userCredentials.password
    );
    mockRequest.headers = {
      authorization: `Bearer ${bearerToken}`,
    };
    await authenticateUser(dbClient, env.logger)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    const testUserRecord = testUser.userRecord.toJSON();
    const returnedUserRecord = mockResponse.locals[USER_PROPERTY];
    expect(returnedUserRecord["uid"]).toBe(
      testUserRecord["uid" as keyof typeof testUserRecord]
    );
    expect(returnedUserRecord["email"]).toBe(
      testUserRecord["email" as keyof typeof testUserRecord]
    );
    expect(nextFunction).toBeCalledTimes(1);
  });
});
