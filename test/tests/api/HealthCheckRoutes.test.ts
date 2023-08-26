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
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { Express } from "express";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/IntegrationTestsUtil";
import { app } from "firebase-admin";
import App = app.App;

describe("should test health check routes", () => {
  let firebaseAdminApp: App;
  let expressApp: Express;
  let userIds: string[];

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
    firebaseAdminApp = setup.firebaseAdminApp;
    expressApp = setup.expressApp;
    userIds = setup.userIds;
  });

  beforeEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
  });

  afterEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runDownMigrations();
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, userIds);
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

  it("returns expected row count for migrations", async () => {
    await request(expressApp).get(`${ROUTE_PREFIX}/migrations`).expect(200);
  });
});
