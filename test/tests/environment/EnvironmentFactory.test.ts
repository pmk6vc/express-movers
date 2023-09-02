import { beforeEach, describe, expect } from "@jest/globals";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { LocalDevHandler } from "../../../src/environment/handlers/LocalDevHandler";
import { LocalDockerComposeHandler } from "../../../src/environment/handlers/LocalDockerComposeHandler";
import { ProductionHandler } from "../../../src/environment/handlers/ProductionHandler";

jest.unmock("../../../src/environment/EnvironmentFactory");

describe("Environment factory should get correct handler type and instance", () => {
  const ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  describe("Factory should return correct handler type based on env var", () => {
    it("returns local dev handler", async () => {
      process.env.NODE_CONFIG_ENV = "local-dev";
      const handler = EnvironmentFactory.getHandler();
      expect(handler).toBeInstanceOf(LocalDevHandler);
    });

    it("returns local docker compose handler", async () => {
      process.env.NODE_CONFIG_ENV = "local-docker-compose";
      const handler = EnvironmentFactory.getHandler();
      expect(handler).toBeInstanceOf(LocalDockerComposeHandler);
    });

    it("returns production handler", async () => {
      process.env.NODE_CONFIG_ENV = "production";
      const handler = EnvironmentFactory.getHandler();
      expect(handler).toBeInstanceOf(ProductionHandler);
    });
  });

  describe("Handlers should implement singleton pattern", () => {
    it("should get same local dev handler singleton instance", async () => {
      process.env.NODE_CONFIG_ENV = "local-dev";
      const handler = EnvironmentFactory.getHandler();
      const secondHandler = EnvironmentFactory.getHandler();
      expect(handler).toBe(secondHandler);
    });

    it("should get same local docker handler singleton instance", async () => {
      process.env.NODE_CONFIG_ENV = "local-docker-compose";
      const handler = EnvironmentFactory.getHandler();
      const secondHandler = EnvironmentFactory.getHandler();
      expect(handler).toBe(secondHandler);
    });

    it("should get same production handler singleton instance", async () => {
      process.env.NODE_CONFIG_ENV = "production";
      const handler = EnvironmentFactory.getHandler();
      const secondHandler = EnvironmentFactory.getHandler();
      expect(handler).toBe(secondHandler);
    });
  });
});
