import { TestEnvironmentHandler } from "./TestEnvironmentHandler";

jest.mock("../../../src/environment/EnvironmentFactory", () => {
  return {
    // Use arrow function to allow jest to perform lazy loading of TestEnvironmentResolver
    // https://www.bam.tech/en/article/fix-jest-mock-cannot-access-before-initialization-error
    getHandler: () => TestEnvironmentHandler.getInstance(),
  };
});
