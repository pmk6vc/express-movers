import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import { Express } from "express";
import request from "supertest";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import { app } from "firebase-admin";
import App = app.App;
import { ITestUser } from "../../util/integration/ITestUser";
import DatabaseClient from "../../../src/db/DatabaseClient";

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
    // TODO: Truncate all tables
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
