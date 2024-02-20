import { beforeEach, describe, expect } from "@jest/globals";
import AppUrlFactory from "../src/AppUrlFactory";

describe("App URL factory should get correct URL", () => {
  const ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  it("returns local dev URL", async () => {
    process.env.CONFIG_ENV = "local-dev";
    const url = AppUrlFactory.getUrl();
    expect(url).toBe("http://localhost:5495");
  });

  it("returns local docker compose URL", async () => {
    process.env.CONFIG_ENV = "local-docker-compose";
    const url = AppUrlFactory.getUrl();
    expect(url).toBe(`http://app:${process.env.APP_PORT}`);
  });

  it("returns production URL", async () => {
    process.env.CONFIG_ENV = "production";
    const url = AppUrlFactory.getUrl();
    expect(url).toBe("https://express-movers-h3fpwbsj7a-uc.a.run.app");
  });
});
