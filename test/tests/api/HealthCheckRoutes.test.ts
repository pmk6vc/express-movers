import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import TestEnvironmentResolver from "../../util/TestEnvironmentResolver";

jest.mock("../../../src/environment/EnvironmentResolver", () => {
  return {
    // Use arrow function to allow jest to perform lazy loading of TestEnvironmentResolver
    getEnvironmentHandler: () => TestEnvironmentResolver.getEnvironmentHandler()
  }
});

describe("should test health check routes", () => {
  beforeAll(async () => {
    await EnvironmentResolver.getEnvironmentHandler().runMigration();
  });

  it("returns expected response for default health check endpoint", async () => {
    const res = await request(app).get("/_health");
    console.log(res)
    expect(res.statusCode).toEqual(200);
  });

  it("returns expected row count for migrations", async () => {
    const res = await request(app).get("/_health/migrations");
    expect(res.statusCode).toEqual(200);
  });
});
