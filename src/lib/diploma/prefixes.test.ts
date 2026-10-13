import { describe, it, expect } from "vitest";
import { isValidPrefix, TREATMENT_PREFIXES } from "./prefixes";

describe("isValidPrefix", () => {
  it.each(TREATMENT_PREFIXES)("accepts %s as a valid prefix", (prefix) => {
    expect(isValidPrefix(prefix)).toBe(true);
  });

  it("rejects arbitrary text", () => {
    expect(isValidPrefix("Ing.")).toBe(false);
    expect(isValidPrefix("<script>")).toBe(false);
  });

  it("rejects null/undefined/empty", () => {
    expect(isValidPrefix(null)).toBe(false);
    expect(isValidPrefix(undefined)).toBe(false);
    expect(isValidPrefix("")).toBe(false);
  });
});
