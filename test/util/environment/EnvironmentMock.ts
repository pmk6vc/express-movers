import TestEnvironmentResolver from "./TestEnvironmentResolver";

// Resolve to test environment in all tests
jest.mock("../../../src/environment/EnvironmentResolver", () => {
  return {
    // Use arrow function to allow jest to perform lazy loading of TestEnvironmentResolver
    // https://www.bam.tech/en/article/fix-jest-mock-cannot-access-before-initialization-error
    getEnvironmentHandler: () =>
      TestEnvironmentResolver.getEnvironmentHandler(),
    getEnvironment: () => TestEnvironmentResolver.getEnvironment(),
  };
});
