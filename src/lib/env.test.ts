import { describe, it, expect, afterEach } from "vitest";
import { requireEnv, normalizePrivateKey } from "./env";

describe("requireEnv", () => {
  const KEY = "__TEST_ENV_VAR__";

  afterEach(() => {
    delete process.env[KEY];
  });

  it("returns the value when the variable is set", () => {
    process.env[KEY] = "some-value";
    expect(requireEnv(KEY)).toBe("some-value");
  });

  it("throws when the variable is missing", () => {
    delete process.env[KEY];
    expect(() => requireEnv(KEY)).toThrow(
      "Missing required environment variable: __TEST_ENV_VAR__",
    );
  });

  it("throws when the variable is an empty string", () => {
    process.env[KEY] = "";
    expect(() => requireEnv(KEY)).toThrow();
  });
});

describe("normalizePrivateKey", () => {
  const PEM =
    "-----BEGIN PRIVATE KEY-----\nMIIBVgIBADANBgkqhkiG9w0BAQEFAASCAT8w\n-----END PRIVATE KEY-----\n";

  it("converts literal \\n sequences into real newlines", () => {
    const literal = PEM.replace(/\n/g, "\\n");
    expect(normalizePrivateKey(literal)).toBe(PEM.trim());
  });

  it("passes through a key that already has real newlines", () => {
    expect(normalizePrivateKey(PEM)).toBe(PEM.trim());
  });

  it("strips surrounding double quotes left over from a JSON file", () => {
    const literal = PEM.replace(/\n/g, "\\n");
    expect(normalizePrivateKey(`"${literal}"`)).toBe(PEM.trim());
  });

  it("strips surrounding single quotes", () => {
    const literal = PEM.replace(/\n/g, "\\n");
    expect(normalizePrivateKey(`'${literal}'`)).toBe(PEM.trim());
  });

  it("trims surrounding whitespace", () => {
    expect(normalizePrivateKey(`  ${PEM}  `)).toBe(PEM.trim());
  });
});
