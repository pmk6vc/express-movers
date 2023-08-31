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
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import request from "supertest";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import { app } from "firebase-admin";
import App = app.App;
import { ITestUser } from "../../util/integration/ITestUser";
import { truncateTables } from "../../util/DatabaseUtil";
import { TABLES_TO_TRUNCATE } from "../../util/TestConstants";

describe("should check auth routes", () => {
  let firebaseAdminApp: App;
  let expressApp: Express;
  let testUsers: ITestUser[];

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
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

  const ROUTE_PREFIX = "/auth";

  it("returns a list of users", async () => {
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/list`)
      .expect(200);
  });
});
