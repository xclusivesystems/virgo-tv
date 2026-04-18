import { describe, it, expect } from "vitest";
import { resolveConcept } from "../shared/revealTokens";

describe("resolveConcept", () => {
  it("returns 'cosmic' for undefined", () => {
    expect(resolveConcept(undefined)).toBe("cosmic");
  });
  it("returns 'cosmic' for empty string", () => {
    expect(resolveConcept("")).toBe("cosmic");
  });
  it("returns 'cosmic' for invalid value", () => {
    expect(resolveConcept("warp")).toBe("cosmic");
  });
  it("returns 'cosmic' explicitly", () => {
    expect(resolveConcept("cosmic")).toBe("cosmic");
  });
  it("returns 'holo' explicitly", () => {
    expect(resolveConcept("holo")).toBe("holo");
  });
});
