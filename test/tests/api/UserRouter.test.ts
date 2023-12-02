import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "@jest/globals";
import { eq } from "drizzle-orm";
import { Express } from "express";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import request from "supertest";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { userTableDef } from "../../../src/db/model/entity/User";
import {
  DEFAULT_TEST_USER,
  TABLES_TO_TRUNCATE,
  TEST_USER_ONE,
  TEST_USER_TWO,
} from "../../util/TestConstants";
import { truncateTables } from "../../util/TestDatabaseUtil";
import { getIdTokenWithEmailPassword } from "../../util/integration/FirebaseEmulatorsUtil";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupDefaultUsers,
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("user routes should work", () => {
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
  let expressApp: Express;
  let testUsers: ITestUser[];

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
    firebaseAdminApp = setup.firebaseAdminApp;
    dbClient = setup.dbClient;
    expressApp = setup.expressApp;
  });

  beforeEach(async () => {
    testUsers = await setupDefaultUsers(firebaseAdminApp, dbClient);
  });

  afterEach(async () => {
    const firebaseUsers = (await getAuth(firebaseAdminApp).listUsers()).users;
    await Promise.all([
      getAuth(firebaseAdminApp).deleteUsers(firebaseUsers.map((u) => u.uid)),
      truncateTables(dbClient, TABLES_TO_TRUNCATE),
    ]);
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, dbClient);
  });

  const ROUTE_PREFIX = "/users";

  describe("should create new user", () => {
    it("blocks create request for duplicate user", async () => {
      const res = await request(expressApp)
        .post(ROUTE_PREFIX)
        .send(DEFAULT_TEST_USER);
      const users = await dbClient.pgPoolClient.select().from(userTableDef);
      expect(res.status).toBe(409);
      expect(res.text).toBe("User already exists");
      expect(users.length).toBe(testUsers.length);
    });

    it("creates new user", async () => {
      // TODO: Check for DB creation (and possible Pub/Sub invocations) once user creation updated
      const res = await request(expressApp)
        .post(ROUTE_PREFIX)
        .send(TEST_USER_ONE);
      const users = await dbClient.pgPoolClient.select().from(userTableDef);
      expect(res.status).toBe(201);
      expect(res.text).toBe(`New user ${TEST_USER_ONE.email} created`);
      expect(users.length).toBe(testUsers.length + 1);
    });

    it("persists user data correctly", async () => {
      // Create new users with varying levels of profile information
      await Promise.all([
        request(expressApp).post(ROUTE_PREFIX).send(TEST_USER_ONE),
        request(expressApp).post(ROUTE_PREFIX).send(TEST_USER_TWO),
      ]);

      // Confirm that user data was persisted to DB correctly
      const testUserOneRow = (
        await dbClient.pgPoolClient
          .select()
          .from(userTableDef)
          .where(eq(userTableDef.email, TEST_USER_ONE.email))
      )[0];
      const testUserOneFirebase = await firebaseAdminApp
        .auth()
        .getUserByEmail(TEST_USER_ONE.email);
      expect(testUserOneRow.uid).toBe(testUserOneFirebase.uid);
      expect(testUserOneRow.email).toBe(testUserOneFirebase.email);
      expect({
        ...testUserOneRow.profile,
        dateOfBirth: new Date(testUserOneRow.profile.dateOfBirth!),
      }).toEqual(TEST_USER_ONE.profile);

      const testUserTwoRow = (
        await dbClient.pgPoolClient
          .select()
          .from(userTableDef)
          .where(eq(userTableDef.email, TEST_USER_TWO.email))
      )[0];
      const testUserTwoFirebase = await firebaseAdminApp
        .auth()
        .getUserByEmail(TEST_USER_TWO.email);
      expect(testUserTwoRow.uid).toBe(testUserTwoFirebase.uid);
      expect(testUserTwoRow.email).toBe(testUserTwoFirebase.email);
      expect(testUserTwoRow.profile).toEqual(TEST_USER_TWO.profile);
    });
  });

  describe("should get user", () => {
    it("blocks request with no authenticated user", async () => {
      const userId = testUsers[0].userRecord.uid;
      const invalidToken = "not-a-valid-token";
      const res = await request(expressApp)
        .get(`${ROUTE_PREFIX}/${userId}`)
        .set("Authorization", `Bearer ${invalidToken}`);
      expect(res.status).toBe(401);
      expect(res.text).toBe("Unauthenticated request");
    });

    it("blocks request for authenticated user with insufficient permissions", async () => {
      const firstUserId = testUsers[0].userRecord.uid;
      const secondUserCredentials = testUsers[1].userCredentials;
      const secondUserToken = await getIdTokenWithEmailPassword(
        secondUserCredentials.email,
        secondUserCredentials.password
      );

      const res = await request(expressApp)
        .get(`${ROUTE_PREFIX}/${firstUserId}`)
        .set("Authorization", `Bearer ${secondUserToken}`);
      expect(res.status).toBe(403);
      expect(res.text).toBe("Unauthorized request");
    });

    it("returns user data for request with valid bearer token", async () => {
      const user = testUsers[0];
      const bearerToken = await getIdTokenWithEmailPassword(
        user.userCredentials.email,
        user.userCredentials.password
      );
      const res = await request(expressApp)
        .get(`${ROUTE_PREFIX}/${user.userRecord.uid}`)
        .set("Authorization", `Bearer ${bearerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        uid: user.userRecord.uid,
        email: user.userCredentials.email,
      });
    });
  });
});
