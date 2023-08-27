import TestEnvironmentResolver from "./environment/TestEnvironmentResolver";
import { afterAll } from "@jest/globals";
import EnvironmentResolver from "../../src/environment/EnvironmentResolver";

// Resolve to test environment in all tests
jest.mock("../../src/environment/EnvironmentResolver", () => {
  return {
    // Use arrow function to allow jest to perform lazy loading of TestEnvironmentResolver
    // https://www.bam.tech/en/article/fix-jest-mock-cannot-access-before-initialization-error
    getEnvironmentHandler: () =>
      TestEnvironmentResolver.getEnvironmentHandler(),
    getEnvironment: () => TestEnvironmentResolver.getEnvironment(),
  };
});

// Tear down database pool after all tests to allow Jest to exit cleanly
afterAll(async () => {
  const env = await EnvironmentResolver.getEnvironment();
  await env.database.getDatabasePool().end();
});
