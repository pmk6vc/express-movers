import { describe, expect, it } from "@jest/globals";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { TestEnvironmentHandler } from "../../util/environment/TestEnvironmentHandler";

describe("Tests should get mocked environment", () => {
  it("returns mocked environment and handler", async () => {
    const handler = EnvironmentFactory.getHandler();
    const environment = await handler.getEnvironment();
    expect(handler).toBeInstanceOf(TestEnvironmentHandler);
    expect(environment.server.serverPort).toBe(5496);
  });

  it("should get same test handler singleton instance", async () => {
    const handler = EnvironmentFactory.getHandler();
    const secondHandler = EnvironmentFactory.getHandler();
    expect(handler).toBe(secondHandler);
  });
});
