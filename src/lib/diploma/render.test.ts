// @vitest-environment node
import { describe, it, expect } from "vitest";
import { renderDiplomaPdf } from "./render";

describe("renderDiplomaPdf", () => {
  it("produces a valid PDF buffer for a precongreso diploma", async () => {
    const buffer = await renderDiplomaPdf({
      attendeeName: "Ana Pérez",
      prefix: "Dra.",
      diplomaType: "precongreso",
      role: "asistente",
      courseCode: "PC1",
      courseName: "Curso de IA",
    });

    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
  });

  it("produces a valid PDF for a general diploma without a course", async () => {
    const buffer = await renderDiplomaPdf({
      attendeeName: "Luis Gómez",
      diplomaType: "general",
      role: "asistente",
    });

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
  });

  it("produces a valid PDF for a conferencista diploma", async () => {
    const buffer = await renderDiplomaPdf({
      attendeeName: "Marta Solís",
      diplomaType: "general",
      role: "conferencista",
    });

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
  });

  it("produces a valid PDF for a moderador diploma", async () => {
    const buffer = await renderDiplomaPdf({
      attendeeName: "Carlos Díaz",
      diplomaType: "precongreso",
      role: "moderador",
      courseCode: "PC2",
      courseName: "Curso de Ecografía",
    });

    expect(buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
  });
});
