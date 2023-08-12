import { describe, expect, it } from "@jest/globals";
import EnvironmentResolver from "../../../src/environment/EnvironmentResolver";
import { TestEnvironmentHandler } from "../../util/environment/TestEnvironmentHandler";

describe("should get mocked environment", () => {
  beforeEach(async () => {
    await EnvironmentResolver.getEnvironmentHandler().getEnvironment();
  });

  it("returns mocked environment and handler", async () => {
    const handler = EnvironmentResolver.getEnvironmentHandler();
    const environment = await EnvironmentResolver.getEnvironment();
    expect(handler).toBeInstanceOf(TestEnvironmentHandler);
    expect(environment.server.serverPort).toBe(5496);
  });
});