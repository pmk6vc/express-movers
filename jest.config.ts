import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/test/util/setup/IntegrationTestSetup.ts"],
  testTimeout: 10000
};

export default config;
