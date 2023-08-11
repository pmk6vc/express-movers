import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { TestEnvironmentHandler } from "../../util/environment/TestEnvironmentHandler";

describe("should test health check routes", () => {
  it("returns mocked environment handler", () => {
    expect(EnvironmentResolver.getEnvironmentHandler()).toBeInstanceOf(TestEnvironmentHandler)
  })

  it("returns expected response for default health check endpoint", async () => {
    const res = await request(app).get("/_health");
    expect(res.statusCode).toEqual(200);
  });

  it("returns expected row count for migrations", async () => {
    const res = await request(app).get("/_health/migrations");
    expect(res.statusCode).toEqual(200);
  });
});
