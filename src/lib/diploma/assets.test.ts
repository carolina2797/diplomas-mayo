import { describe, it, expect, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import {
  resolveBackgroundFilename,
  resolveBackgroundImagePath,
  loadBackgroundImage,
  resolveBackgroundCandidateFilenames,
} from "./assets";

describe("resolveBackgroundFilename", () => {
  it("returns the plain filename for asistente (no suffix)", () => {
    expect(resolveBackgroundFilename("general", "asistente")).toBe("background-general.png");
    expect(resolveBackgroundFilename("precongreso", "asistente")).toBe(
      "background-precongreso.png",
    );
  });

  it("adds a role suffix for conferencista/moderador", () => {
    expect(resolveBackgroundFilename("general", "conferencista")).toBe(
      "background-general-conferencista.png",
    );
    expect(resolveBackgroundFilename("general", "moderador")).toBe(
      "background-general-moderador.png",
    );
  });

  it("builds a slug-based filename for a specific precongreso code, preserving case", () => {
    expect(resolveBackgroundFilename("precongreso", "asistente", "PC1")).toBe(
      "background-precongreso-PC1.png",
    );
    expect(resolveBackgroundFilename("precongreso", "moderador", "PC1")).toBe(
      "background-precongreso-PC1-moderador.png",
    );
  });

  it("slugifies accents/spaces in the code without lowercasing it", () => {
    expect(resolveBackgroundFilename("precongreso", "asistente", "Curso Ñ 1")).toBe(
      "background-precongreso-Curso-1.png",
    );
  });

  it("returns the generic precongreso filename when there is no code", () => {
    expect(resolveBackgroundFilename("precongreso", "asistente")).toBe(
      "background-precongreso.png",
    );
    expect(resolveBackgroundFilename("precongreso", "asistente", null)).toBe(
      "background-precongreso.png",
    );
  });
});

describe("resolveBackgroundCandidateFilenames", () => {
  it("returns a single candidate for general (no generic fallback)", () => {
    expect(resolveBackgroundCandidateFilenames("general", "conferencista")).toEqual([
      "background-general-conferencista.png",
    ]);
  });

  it("returns the dedicated + generic filenames, in that order, for precongreso", () => {
    expect(resolveBackgroundCandidateFilenames("precongreso", "moderador", "PC1")).toEqual([
      "background-precongreso-PC1-moderador.png",
      "background-precongreso-moderador.png",
    ]);
  });

  it("still returns two candidates (both generic) when there's no course code", () => {
    expect(resolveBackgroundCandidateFilenames("precongreso", "asistente")).toEqual([
      "background-precongreso.png",
      "background-precongreso.png",
    ]);
  });
});

describe("resolveBackgroundImagePath", () => {
  const tmpFile = path.join(os.tmpdir(), `diploma-test-${Date.now()}.png`);

  afterEach(() => {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  });

  it("returns the path when the file exists", () => {
    fs.writeFileSync(tmpFile, "fake-image-content");
    expect(resolveBackgroundImagePath(tmpFile)).toBe(tmpFile);
  });

  it("returns null when the file does not exist", () => {
    expect(resolveBackgroundImagePath(tmpFile)).toBeNull();
  });
});

describe("loadBackgroundImage", () => {
  const tmpFile = path.join(os.tmpdir(), `diploma-load-test-${Date.now()}.png`);

  afterEach(() => {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  });

  it("returns the file contents as a Buffer when the file exists", () => {
    fs.writeFileSync(tmpFile, "fake-image-content");
    const result = loadBackgroundImage(tmpFile);
    expect(result).toBeInstanceOf(Buffer);
    expect(result?.toString()).toBe("fake-image-content");
  });

  it("returns null when the file does not exist", () => {
    expect(loadBackgroundImage(tmpFile)).toBeNull();
  });
});
