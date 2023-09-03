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
import { TABLES_TO_TRUNCATE } from "../../util/TestConstants";
import { truncateTables } from "../../util/TestDatabaseUtil";
import { ITestUser } from "../../util/integration/ITestUser";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("should check auth routes", () => {
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
  let expressApp: Express;
  let testUsers: ITestUser[];

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
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

  const ROUTE_PREFIX = "/auth";

  it("returns a list of users", async () => {
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/list`)
      .expect(200);
  });
});
