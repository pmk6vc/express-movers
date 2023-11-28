import { describe } from "@jest/globals";

describe("user authorization should work", () => {
  it("should raise error for request without authenticated user", async () => {});

  it("should reject request from user accessing another user's data", async () => {});

  it("should authorize request from user on their own data", async () => {});

  it("should authorize request from super user on any user data", async () => {
    // TODO
  });
});
