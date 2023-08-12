import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { TestEnvironmentHandler } from "../../util/environment/TestEnvironmentHandler";

describe("should get mocked environment", () => {
  beforeEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().getEnvironment();
  });

  it("returns mocked environment and handler", async () => {
    const handler = EnvironmentResolver.getEnvironmentHandler();
    const environment = await EnvironmentResolver.getEnvironment();
    expect(handler).toBeInstanceOf(TestEnvironmentHandler);
    expect(environment.server.serverPort).toBe(5496);
  });
});

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
