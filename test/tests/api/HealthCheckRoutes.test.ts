import {
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  describe,
  expect,
  it,
} from "@jest/globals";
import request from "supertest";
import { Express } from "express";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import { app } from "firebase-admin";
import App = app.App;
import { ITestUser } from "../../util/integration/ITestUser";
import DatabaseClient from "../../../src/db/DatabaseClient";

describe("should test health check routes", () => {
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

  const ROUTE_PREFIX = "/_health";

  it("returns expected response for default health check endpoint", async () => {
    const res = await request(expressApp)
      .get(ROUTE_PREFIX)
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8");
    expect(res.body).toEqual({});
    expect(res.text).toBe("Hello, world!");
  });

  it("returns expected row count for users", async () => {
    await request(expressApp).get(`${ROUTE_PREFIX}/users`).expect(200);
  });
});
