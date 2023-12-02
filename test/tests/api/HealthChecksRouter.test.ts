import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Express } from "express";
import { app } from "firebase-admin";
import request from "supertest";
import DatabaseClient from "../../../src/db/DatabaseClient";
import {
  setupIntegrationTest,
  tearDownIntegrationTest,
} from "../../util/integration/IntegrationTestsUtil";
import App = app.App;

describe("should test health check", () => {
  let firebaseAdminApp: App;
  let dbClient: DatabaseClient;
  let expressApp: Express;

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
    firebaseAdminApp = setup.firebaseAdminApp;
    dbClient = setup.dbClient;
    expressApp = setup.expressApp;
  });

  afterAll(async () => {
    await tearDownIntegrationTest(firebaseAdminApp, dbClient);
  });

  const ROUTE_PREFIX = "/_health";

  it("returns expected response for ping endpoint", async () => {
    const res = await request(expressApp)
      .get(`${ROUTE_PREFIX}/ping`)
      .expect("Content-Type", "text/html; charset=utf-8");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
    expect(res.text).toBe("Ping!");
  });
});
