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
  TEST_USER_ONE,
  TEST_USER_TWO,
} from "../../util/TestConstants";
import { getIdTokenWithEmailPassword } from "../../util/integration/FirebaseEmulatorsUtil";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupDefaultUsers,
  setupIntegrationTest,
  tearDownIntegrationTest,
  tearDownTestData,
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
    await tearDownTestData(firebaseAdminApp, dbClient);
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, dbClient);
  });

  const ROUTE_PREFIX = "/users";

  describe("should create new user in Firebase", () => {
    it("blocks create request for duplicate user", async () => {
      const { email, password } = DEFAULT_TEST_USER;
      const res = await request(expressApp)
        .post(ROUTE_PREFIX)
        .send({ email, password });
      expect(res.status).toBe(409);
      expect(res.text).toBe("User already exists");
    });

    it("creates new user", async () => {
      const fetchUserOne = async () => {
        return getAuth(firebaseAdminApp).getUserByEmail(TEST_USER_ONE.email);
      };
      await expect(fetchUserOne).rejects.toThrow();

      const { email, password } = TEST_USER_ONE;
      const res = await request(expressApp)
        .post(ROUTE_PREFIX)
        .send({ email, password });
      expect(res.status).toBe(201);
      expect(res.text).toBe(`New user ${TEST_USER_ONE.email} created`);
      expect((await fetchUserOne()).email).toEqual(TEST_USER_ONE.email);
    });
  });

  describe("should persist new Firebase user in database", () => {
    it("blocks request for user that does not exist in Firebase", async () => {
      const userId = "not-a-real-uid";
      const res = await request(expressApp)
        .post(`${ROUTE_PREFIX}/writeNewUser`)
        .send({
          uid: userId,
        });
      expect(res.status).toBe(409);
      expect(res.text).toBe(`User ${userId} cannot be found in Firebase`);
    });

    it("blocks database write for duplicate user", async () => {
      const userId = testUsers[0].userRecord.uid;
      const res = await request(expressApp)
        .post(`${ROUTE_PREFIX}/writeNewUser`)
        .send({
          uid: userId,
        });
      expect(res.status).toBe(409);
      expect(res.text).toBe(`User ${userId} already exists`);
    });

    it("persists new Firebase user in database", async () => {
      const fetchUserOne = async () => {
        return dbClient.pgPoolClient
          .select()
          .from(userTableDef)
          .where(eq(userTableDef.email, TEST_USER_ONE.email));
      };
      const beforeRequest = await fetchUserOne();
      expect(beforeRequest.length).toBe(0);

      const userOne = await getAuth(firebaseAdminApp).createUser(TEST_USER_ONE);
      const res = await request(expressApp)
        .post(`${ROUTE_PREFIX}/writeNewUser`)
        .send({
          uid: userOne.uid,
        });
      expect(res.status).toBe(201);
      expect(res.text).toBe(`New user ${TEST_USER_ONE.email} created`);

      const afterRequest = await fetchUserOne();
      const userOneDb = afterRequest[0];
      expect(afterRequest.length).toBe(1);
      expect(userOneDb.uid).toBe(userOne.uid);
      expect(userOne.email).toBe(TEST_USER_ONE.email);
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
      // Create new users in Firebase and database without any special roles
      const [userOneFirebase, userTwoFirebase] = await Promise.all([
        getAuth(firebaseAdminApp).createUser(TEST_USER_ONE),
        getAuth(firebaseAdminApp).createUser(TEST_USER_TWO),
      ]);
      await Promise.all([
        request(expressApp).post(`${ROUTE_PREFIX}/writeNewUser`).send({
          uid: userOneFirebase.uid,
        }),
        request(expressApp).post(`${ROUTE_PREFIX}/writeNewUser`).send({
          uid: userTwoFirebase.uid,
        }),
      ]);

      // Attempt to fetch user data with token from different user
      const userTwoToken = await getIdTokenWithEmailPassword(
        TEST_USER_TWO.email,
        TEST_USER_TWO.password,
      );
      const res = await request(expressApp)
        .get(`${ROUTE_PREFIX}/${userOneFirebase.uid}`)
        .set("Authorization", `Bearer ${userTwoToken}`);
      expect(res.status).toBe(403);
      expect(res.text).toBe("Unauthorized request");
    });

    it("returns user data for authenticated user with permissions", async () => {
      const user = testUsers[0];
      const bearerToken = await getIdTokenWithEmailPassword(
        user.userCredentials.email,
        user.userCredentials.password,
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

  describe("should persist user profile", () => {
    // TODO: Add this test for profile update
    // it("persists user data correctly", async () => {
    //   // Create new users with varying levels of profile information
    //   await Promise.all([
    //     request(expressApp).post(ROUTE_PREFIX).send(TEST_USER_ONE),
    //     request(expressApp).post(ROUTE_PREFIX).send(TEST_USER_TWO),
    //   ]);
    //
    //   // Confirm that user data was persisted to DB correctly
    //   const testUserOneRow = (
    //     await dbClient.pgPoolClient
    //       .select()
    //       .from(userTableDef)
    //       .where(eq(userTableDef.email, TEST_USER_ONE.email))
    //   )[0];
    //   const testUserOneFirebase = await firebaseAdminApp
    //     .auth()
    //     .getUserByEmail(TEST_USER_ONE.email);
    //   expect(testUserOneRow.uid).toBe(testUserOneFirebase.uid);
    //   expect(testUserOneRow.email).toBe(testUserOneFirebase.email);
    //   expect({
    //     ...testUserOneRow.profile,
    //     dateOfBirth: new Date(testUserOneRow.profile.dateOfBirth!),
    //   }).toEqual(TEST_USER_ONE.profile);
    //
    //   const testUserTwoRow = (
    //     await dbClient.pgPoolClient
    //       .select()
    //       .from(userTableDef)
    //       .where(eq(userTableDef.email, TEST_USER_TWO.email))
    //   )[0];
    //   const testUserTwoFirebase = await firebaseAdminApp
    //     .auth()
    //     .getUserByEmail(TEST_USER_TWO.email);
    //   expect(testUserTwoRow.uid).toBe(testUserTwoFirebase.uid);
    //   expect(testUserTwoRow.email).toBe(testUserTwoFirebase.email);
    //   expect(testUserTwoRow.profile).toEqual(TEST_USER_TWO.profile);
    // });
  });
});
