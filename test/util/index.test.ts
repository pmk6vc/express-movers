import { describe, expect, test } from "@jest/globals";

describe("should run tests", () => {
  test("1 plus 2 equals 3", () => {
    expect(1 + 2).toBe(3);
  });

  test("2 times 2 equals 4", () => expect(2 * 2).toBe(4));
});
