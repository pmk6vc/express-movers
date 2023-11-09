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
import authenticateUser, {
  USER_PROPERTY,
} from "../../../src/middleware/AuthenticateUser";
import { FIRST_TEST_USER } from "../../util/TestConstants";
import { getIdTokenWithEmailPassword } from "../../util/integration/FirebaseEmulatorsUtil";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("authentication middleware should work", () => {
  let firebaseAdminApp: App;
  let testUsers: ITestUser[];
  let mockRequest: Request;
  let nextFunction: NextFunction;
  const mockResponse: Response = {
    locals: {},
  } as Response;
  const USER_PROPERTY_KEY = USER_PROPERTY as keyof typeof mockResponse.locals;

  async function setupUsers(firebaseAdminApp: App): Promise<ITestUser[]> {
    const userRecord = await getAuth(firebaseAdminApp).createUser(
      FIRST_TEST_USER
    );
    const user = {
      userRecord: userRecord,
      userCredentials: {
        email: FIRST_TEST_USER.email,
        password: FIRST_TEST_USER.password,
      },
    };
    return [user];
  }

  beforeAll(async () => {
    const setup = await setupIntegrationTest(setupUsers);
    firebaseAdminApp = setup.firebaseAdminApp;
    testUsers = setup.testUsers;
  });

  beforeEach(() => {
    mockRequest = {
      headers: {},
    } as Request;
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, testUsers);
  });

  it("should not assign user if bearer token is missing", async () => {
    await authenticateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.locals[USER_PROPERTY_KEY]).toBe(undefined);
    expect(nextFunction).toBeCalledTimes(1);
  });

  it("should not assign user if bearer token is invalid", async () => {
    mockRequest = {
      headers: {
        authorization: "Bearer Invalid token",
      },
    } as Request;
    await authenticateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.locals[USER_PROPERTY_KEY]).toBe(undefined);
    expect(nextFunction).toBeCalledTimes(1);
  });

  it("should assign user if valid bearer token is passed", async () => {
    const testUser = testUsers[0];
    const bearerToken = await getIdTokenWithEmailPassword(
      testUser.userCredentials.email,
      testUser.userCredentials.password
    );
    mockRequest = {
      headers: {
        authorization: `Bearer ${bearerToken}`,
      },
    } as Request;
    await authenticateUser(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    const testUserRecord = testUser.userRecord.toJSON();
    const returnedUserRecord = mockResponse.locals[USER_PROPERTY_KEY];
    expect(returnedUserRecord["uid"]).toBe(
      testUserRecord["uid" as keyof typeof testUserRecord]
    );
    expect(returnedUserRecord["email"]).toBe(
      testUserRecord["email" as keyof typeof testUserRecord]
    );
    expect(nextFunction).toBeCalledTimes(1);
  });
});
