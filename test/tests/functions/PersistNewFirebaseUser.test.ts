import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "@jest/globals";
import { Express } from "express";
import { app } from "firebase-admin";
import request from "supertest";
import DatabaseClient from "../../../src/db/DatabaseClient";
import { TEST_USER_ONE } from "../../util/TestConstants";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupDefaultUsers,
  setupIntegrationTest,
  tearDownIntegrationTest,
  tearDownTestData,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("new user persistence should work", () => {
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
  let expressApp: Express;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  it("invoked upon user creation", async () => {
    const persistNewFirebaseUserMock = jest.fn();
    jest.mock("functions/src", () => {
      return {
        persistNewFirebaseUser: persistNewFirebaseUserMock,
      };
    });
    await request(expressApp).post("/users").send(TEST_USER_ONE);
    expect(persistNewFirebaseUserMock).toHaveBeenCalledTimes(1);
  });
});
