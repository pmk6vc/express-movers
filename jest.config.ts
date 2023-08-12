import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/test/util/environment/EnvironmentMock.ts"],
  testTimeout: 30000,
};

export default config;
