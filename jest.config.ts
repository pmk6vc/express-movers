import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "<rootDir>/test/util/environment/EnvironmentHandlerMock.ts",
  ],
  testTimeout: 30000,
  collectCoverage: true,
  collectCoverageFrom: ["src/api/**"],
};

export default config;
