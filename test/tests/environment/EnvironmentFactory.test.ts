import { beforeEach, describe, expect } from "@jest/globals";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { LocalDevHandler } from "../../../src/environment/handlers/LocalDevHandler";
import { LocalDockerComposeHandler } from "../../../src/environment/handlers/LocalDockerComposeHandler";
import { ProductionHandler } from "../../../src/environment/handlers/ProductionHandler";

jest.unmock("../../../src/environment/EnvironmentFactory");

describe("Environment factory should get correct handler based on env var", () => {
  const ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  it("returns same local dev handler for local dev", async () => {
    process.env.NODE_CONFIG_ENV = "local-dev";
    const handler = EnvironmentFactory.getHandler();
    expect(handler).toBeInstanceOf(LocalDevHandler);
    const secondHandler = EnvironmentFactory.getHandler();
    expect(handler).toBe(secondHandler);
  });

  it("returns local docker compose handler for local docker", async () => {
    process.env.NODE_CONFIG_ENV = "local-docker-compose";
    const handler = EnvironmentFactory.getHandler();
    expect(handler).toBeInstanceOf(LocalDockerComposeHandler);
    const secondHandler = EnvironmentFactory.getHandler();
    expect(handler).toBe(secondHandler);
  });

  it("returns production handler for production", async () => {
    process.env.NODE_CONFIG_ENV = "production";
    const handler = EnvironmentFactory.getHandler();
    expect(handler).toBeInstanceOf(ProductionHandler);
    const secondHandler = EnvironmentFactory.getHandler();
    expect(handler).toBe(secondHandler);
  });
});
