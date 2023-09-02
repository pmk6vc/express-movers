import { describe, expect, it } from "@jest/globals";
import EnvironmentFactory from "../../../src/environment/EnvironmentFactory";
import { TestEnvironmentHandler } from "../../util/environment/TestEnvironmentHandler";

describe("should get mocked environment", () => {
  // beforeEach(async () => {
  //   await EnvironmentResolver.getEnvironmentHandler().getEnvironment();
  // });

  it("returns mocked environment and handler", async () => {
    const handler = EnvironmentFactory.getHandler();
    const environment = await handler.getEnvironment();
    expect(handler).toBeInstanceOf(TestEnvironmentHandler);
    expect(environment.server.serverPort).toBe(5496);
  });
});
