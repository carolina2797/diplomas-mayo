import { describe, it, expect } from "vitest";
import { buildDiplomaDownloadUrl } from "./downloadUrl";

describe("buildDiplomaDownloadUrl", () => {
  it("builds a url with email and type, url-encoding the email", () => {
    const url = buildDiplomaDownloadUrl({ email: "ana@correo.com", type: "general" });
    expect(url).toBe("/api/diploma/download?email=ana%40correo.com&tipo=general");
  });

  it("includes the prefix when provided", () => {
    const url = buildDiplomaDownloadUrl({
      email: "ana@correo.com",
      type: "precongreso",
      prefix: "Dra.",
    });
    expect(url).toBe(
      "/api/diploma/download?email=ana%40correo.com&tipo=precongreso&prefijo=Dra.",
    );
  });

  it("omits the prefix param when null or empty", () => {
    const url = buildDiplomaDownloadUrl({ email: "ana@correo.com", type: "general", prefix: "" });
    expect(url).toBe("/api/diploma/download?email=ana%40correo.com&tipo=general");
  });
});
