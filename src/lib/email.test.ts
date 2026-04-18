import { describe, it, expect } from "vitest";
import { isValidEmail } from "./email";

describe("isValidEmail", () => {
  it.each([
    ["a@b.co", true],
    ["test.person+tag@example.com", true],
    ["no-at-symbol.com", false],
    ["missing-tld@foo", false],
    ["@nohead.com", false],
    ["spaces in@email.com", false],
    ["", false],
  ])("%s -> %s", (input, expected) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});
