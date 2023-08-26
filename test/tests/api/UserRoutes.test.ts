import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
} from "@jest/globals";
import { Express } from "express";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/IntegrationTestsUtil";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { app } from "firebase-admin";
import App = app.App;
import request from "supertest";
import { getAuth } from "firebase-admin/auth";
import { ITestUser } from "../../util/ITestUser";
import { getIdTokenWithEmailPassword } from "../../util/FirebaseEmulatorsUtil";

describe("should check user routes", () => {
  let firebaseAdminApp: App;
  let expressApp: Express;
  let testUsers: ITestUser[];

  async function setupUsers(firebaseAdminApp: App): Promise<ITestUser[]> {
    const firstEmail = "first@user.com";
    const firstPassword = "firstUser";
    const firstUserRecord = await getAuth(firebaseAdminApp).createUser({
      email: firstEmail,
      password: firstPassword,
    });
    const firstUser = {
      userRecord: firstUserRecord,
      userCredentials: {
        email: firstEmail,
        password: firstPassword,
      },
    };

    const secondEmail = "second@user.com";
    const secondPassword = "secondUser";
    const secondUserRecord = await getAuth(firebaseAdminApp).createUser({
      email: secondEmail,
      password: secondPassword,
    });
    const secondUser = {
      userRecord: secondUserRecord,
      userCredentials: {
        email: secondEmail,
        password: secondPassword,
      },
    };
    return [firstUser, secondUser];
  }

  beforeAll(async () => {
    const setup = await setupIntegrationTest(setupUsers);
    firebaseAdminApp = setup.firebaseAdminApp;
    expressApp = setup.expressApp;
    testUsers = setup.testUsers;
  });

  beforeEach(async () => {
    jest.resetModules();
    await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
  });

  afterEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runDownMigrations();
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, testUsers);
  });

  const ROUTE_PREFIX = "/users";

  it("blocks request with no bearer token", async () => {
    const userId = testUsers[0].userRecord.uid;
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/${userId}`)
      .expect(401);
    expect(res.text).toBe("No bearer token found");
  });

  it("blocks request with invalid bearer token", async () => {
    const userId = testUsers[0].userRecord.uid;
    const invalidToken = "not-a-valid-token";
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/${userId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);
    expect(res.text).toBe("Invalid bearer token");
  });

  it("blocks request with bearer token for another user", async () => {
    const firstUserId = testUsers[0].userRecord.uid;
    const secondUserCredentials = testUsers[1].userCredentials;
    const secondUserToken = await getIdTokenWithEmailPassword(
      secondUserCredentials.email,
      secondUserCredentials.password
    );
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/${firstUserId}`)
      .set("Authorization", `Bearer ${secondUserToken}`)
      .expect(403);
    expect(res.text).toBe("Unauthorized access");
  });

  it("returns user data for request with valid bearer token", async () => {});
});
