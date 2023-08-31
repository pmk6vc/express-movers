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
} from "../../util/integration/IntegrationTestsUtil";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { app } from "firebase-admin";
import App = app.App;
import request from "supertest";
import { getAuth } from "firebase-admin/auth";
import { ITestUser } from "../../util/integration/ITestUser";
import { getIdTokenWithEmailPassword } from "../../util/integration/FirebaseEmulatorsUtil";
import {
  FIRST_TEST_USER,
  SECOND_TEST_USER,
  TABLES_TO_TRUNCATE,
} from "../../util/TestConstants";
import { truncateTables } from "../../util/DatabaseUtil";

describe("should check user routes", () => {
  let firebaseAdminApp: App;
  let expressApp: Express;
  let testUsers: ITestUser[];

  async function setupUsers(firebaseAdminApp: App): Promise<ITestUser[]> {
    const firstUserRecord = await getAuth(firebaseAdminApp).createUser(
      FIRST_TEST_USER
    );
    const firstUser = {
      userRecord: firstUserRecord,
      userCredentials: {
        email: FIRST_TEST_USER.email,
        password: FIRST_TEST_USER.password,
      },
    };

    const secondUserRecord = await getAuth(firebaseAdminApp).createUser(
      SECOND_TEST_USER
    );
    const secondUser = {
      userRecord: secondUserRecord,
      userCredentials: {
        email: SECOND_TEST_USER.email,
        password: SECOND_TEST_USER.password,
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
    await EnvironmentResolver.getEnvironmentHandler().runMigrations();
  });

  afterEach(async () => {
    const env = await EnvironmentResolver.getEnvironment();
    await truncateTables(env, TABLES_TO_TRUNCATE);
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
    expect(res.text).toBe("Unauthenticated request");
  });

  it("blocks request with invalid bearer token", async () => {
    const userId = testUsers[0].userRecord.uid;
    const invalidToken = "not-a-valid-token";
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/${userId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .expect(401);
    expect(res.text).toBe("Unauthenticated request");
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
    expect(res.text).toBe("Unauthorized request");
  });

  it("returns user data for request with valid bearer token", async () => {
    const userId = testUsers[0].userRecord.uid;
    const userCredentials = testUsers[0].userCredentials;
    const bearerToken = await getIdTokenWithEmailPassword(
      userCredentials.email,
      userCredentials.password
    );
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/${userId}`)
      .set("Authorization", `Bearer ${bearerToken}`)
      .expect(200);
    expect(res.body).toMatchObject({
      uid: userId,
      email: userCredentials.email,
    });
  });
});
