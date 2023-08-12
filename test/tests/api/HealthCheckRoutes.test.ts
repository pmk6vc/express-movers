import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";

describe("should test health check routes", () => {
  beforeEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
  });

  afterEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runDownMigrations();
  });

  it("returns expected response for default health check endpoint", async () => {
    const res = await request(app).get("/_health");
    expect(res.statusCode).toBe(200);
  });

  it("returns expected row count for migrations", async () => {
    const res = await request(app).get("/_health/migrations");
    expect(res.statusCode).toBe(200);
  });
});
