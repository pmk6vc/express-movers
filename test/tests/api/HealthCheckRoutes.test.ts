import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { buildApp } from "../../../src/app";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { Express } from "express";

describe("should test health check routes", () => {
  let app: Express;

  beforeAll(async () => {
    const env = await EnvironmentResolver.getEnvironment();
    app = buildApp(env);
  });

  beforeEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
  });

  afterEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runDownMigrations();
  });

  const ROUTE_PREFIX = "/_health";

  it("returns expected response for default health check endpoint", async () => {
    const res = await request(app)
      .get(ROUTE_PREFIX)
      .expect(200)
      .expect("Content-Type", "text/html; charset=utf-8");
    expect(res.body).toEqual({});
    expect(res.text).toBe("Hello, world!");
  });

  it("returns expected row count for migrations", async () => {
    const res = await request(app).get(`${ROUTE_PREFIX}/migrations`);
    expect(res.statusCode).toBe(200);
  });
});
