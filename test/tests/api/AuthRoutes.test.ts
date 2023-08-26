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
} from "../../util/IntegrationTestsUtil";
import { app } from "firebase-admin";
import App = app.App;

describe("should check auth routes", () => {
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
    jest.resetModules();
    await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
  });

  afterEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runDownMigrations();
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, userIds);
  });

  const ROUTE_PREFIX = "/auth";

  it("returns a list of users", async () => {
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/list`)
      .expect(200);
    console.log(res.body);
  });
});
