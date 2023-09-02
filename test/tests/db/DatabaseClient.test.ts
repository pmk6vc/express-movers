import { describe, expect } from "@jest/globals";
import DatabaseClient from "../../../src/db/DatabaseClient";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";

describe("Database client should implement singleton pattern", () => {
  it("should get same database client singleton instance", async () => {
    const environment = await EnvironmentFactory.getHandler().getEnvironment();
    const dbClient = DatabaseClient.getInstance(environment);
    const secondDbClient = DatabaseClient.getInstance(environment);
    expect(dbClient).toBe(secondDbClient);
  });
});
