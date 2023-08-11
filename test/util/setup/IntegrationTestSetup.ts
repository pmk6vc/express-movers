import TestEnvironmentResolver from "../environment/TestEnvironmentResolver";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";

// Resolve to test environment in all tests
jest.mock("../../../src/environment/EnvironmentResolver", () => {
  return {
    // Use arrow function to allow jest to perform lazy loading of TestEnvironmentResolver
    getEnvironmentHandler: () => TestEnvironmentResolver.getEnvironmentHandler(),
    getEnvironment: () => TestEnvironmentResolver.getEnvironment()
  }
});

// Run migrations in test lifecycle
beforeEach(async () => {
  await EnvironmentResolver.getEnvironmentHandler().runUpMigrations();
});

afterEach(async() => {
  await EnvironmentResolver.getEnvironmentHandler().runDownMigrations()
})