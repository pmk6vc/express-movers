import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
} from "@jest/globals";
import { eq, sql } from "drizzle-orm";
import { Express } from "express";
import { app } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import request from "supertest";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { userTableDef } from "../../../src/db/model/entity/User";
import {
  FIRST_TEST_USER,
  SECOND_TEST_USER,
  TABLES_TO_TRUNCATE,
} from "../../util/TestConstants";
import { truncateTables } from "../../util/TestDatabaseUtil";
import { getIdTokenWithEmailPassword } from "../../util/integration/FirebaseEmulatorsUtil";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("user routes should work", () => {
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
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
      profile: FIRST_TEST_USER.profile,
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
      profile: SECOND_TEST_USER.profile,
    };
    return [firstUser, secondUser];
  }

  beforeAll(async () => {
    const setup = await setupIntegrationTest(setupUsers);
    firebaseAdminApp = setup.firebaseAdminApp;
    dbClient = setup.dbClient;
    expressApp = setup.expressApp;
    testUsers = setup.testUsers;
  });

  beforeEach(async () => {
    await dbClient.runMigrations();
  });

  afterEach(async () => {
    await truncateTables(dbClient, TABLES_TO_TRUNCATE);
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, testUsers);
    await dbClient.close();
  });

  const ROUTE_PREFIX = "/users";

  describe("should create new customer", () => {
    const NEW_USER_ROUTE_PREFIX = `${ROUTE_PREFIX}`;
    const newUserHelper = async (user: ITestUser) => {
      const bearerToken = await getIdTokenWithEmailPassword(
        user.userCredentials.email,
        user.userCredentials.password
      );
      const requestBody = {
        email: user.userCredentials.email,
        profile: user.profile,
      };
      return request(expressApp)
        .post(NEW_USER_ROUTE_PREFIX)
        .set("Authorization", `Bearer ${bearerToken}`)
        .send(requestBody);
    };

    it("blocks create request with no authenticated user", async () => {
      const requestBody = {
        email: testUsers[0].userCredentials.email,
        profile: {},
      };
      const invalidToken = "not-a-valid-token";
      const res = await request(expressApp)
        .post(NEW_USER_ROUTE_PREFIX)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(requestBody);
      const numUsers = (
        await dbClient.pgPoolClient
          .select({
            count: sql<number>`count(*)::int`,
          })
          .from(userTableDef)
      )[0].count;
      expect(res.status).toBe(401);
      expect(res.text).toBe("Unauthenticated request");
      expect(numUsers).toBe(0);
    });

    it("creates new authenticated user", async () => {
      const user = testUsers[0];
      const res = await newUserHelper(user);
      const users = await dbClient.pgPoolClient.select().from(userTableDef);
      expect(res.status).toBe(201);
      expect(res.text).toBe(`New user ${user.userRecord.uid} created`);
      expect(users.length).toBe(1);
    });

    it("persists user data correctly", async () => {
      // Create new users with varying levels of profile information
      const firstUser = testUsers[0];
      const secondUser = testUsers[1];
      await Promise.all([newUserHelper(firstUser), newUserHelper(secondUser)]);

      // Confirm that user data was persisted to DB correctly
      const firstUserRow = (
        await dbClient.pgPoolClient
          .select()
          .from(userTableDef)
          .where(eq(userTableDef.uid, firstUser.userRecord.uid))
      )[0];
      expect(firstUserRow.uid).toBe(firstUser.userRecord.uid);
      expect(firstUserRow.email).toBe(firstUser.userCredentials.email);
      expect({
        ...firstUserRow.profile,
        dateOfBirth: new Date(firstUserRow.profile.dateOfBirth!),
      }).toEqual(firstUser.profile);

      const secondUserRow = (
        await dbClient.pgPoolClient
          .select()
          .from(userTableDef)
          .where(eq(userTableDef.uid, secondUser.userRecord.uid))
      )[0];
      expect(secondUserRow.uid).toBe(secondUser.userRecord.uid);
      expect(secondUserRow.email).toBe(secondUser.userCredentials.email);
      expect(secondUserRow.profile).toEqual(secondUser.profile);
    });

    it("blocks create request for duplicate user", async () => {
      const user = testUsers[0];
      await newUserHelper(user);
      const res = await newUserHelper(user);
      const users = await dbClient.pgPoolClient.select().from(userTableDef);
      expect(res.status).toBe(409);
      expect(res.text).toBe("User already exists");
      expect(users.length).toBe(1);
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

    it("blocks request with bearer token for another user", async () => {
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
