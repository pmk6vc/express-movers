import { beforeEach, describe, expect } from "@jest/globals";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { LocalDevHandler } from "../../../src/environment/handlers/LocalDevHandler";
import { LocalDockerComposeHandler } from "../../../src/environment/handlers/LocalDockerComposeHandler";
import { ProductionHandler } from "../../../src/environment/handlers/ProductionHandler";

describe("Environment factory should get correct handler based on env var", () => {
  const ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  it("returns local dev handler for local dev", async () => {
    process.env.NODE_CONFIG_ENV = "local-dev";
    const handler = new EnvironmentFactory().getHandler();
    expect(handler).toBeInstanceOf(LocalDevHandler);
  });

  it("returns local docker compose handler for local docker", async () => {
    process.env.NODE_CONFIG_ENV = "local-docker-compose";
    const handler = new EnvironmentFactory().getHandler();
    expect(handler).toBeInstanceOf(LocalDockerComposeHandler);
  });

  it("returns production handler for production", async () => {
    process.env.NODE_CONFIG_ENV = "production";
    const handler = new EnvironmentFactory().getHandler();
    expect(handler).toBeInstanceOf(ProductionHandler);
  });
});
