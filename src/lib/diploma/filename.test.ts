import { describe, it, expect } from "vitest";
import { buildDiplomaFilename } from "./filename";

describe("buildDiplomaFilename", () => {
  it("returns a fixed filename for the general/asistente diploma", () => {
    expect(buildDiplomaFilename({ diplomaType: "general", role: "asistente" })).toBe(
      "diploma-participacion-general.pdf",
    );
  });

  it("slugifies the course name for a precongreso/asistente diploma", () => {
    expect(
      buildDiplomaFilename({
        diplomaType: "precongreso",
        role: "asistente",
        courseName: "Diseño de Producto",
      }),
    ).toBe("diploma-diseno-de-producto.pdf");
  });

  it("falls back to a generic slug when the course name is missing", () => {
    expect(buildDiplomaFilename({ diplomaType: "precongreso", role: "asistente" })).toBe(
      "diploma-precongreso.pdf",
    );
  });

  it("falls back to a generic slug when the course name has no alphanumeric characters", () => {
    expect(
      buildDiplomaFilename({ diplomaType: "precongreso", role: "asistente", courseName: "!!!" }),
    ).toBe("diploma-precongreso.pdf");
  });

  it("prefixes the role for a conferencista general diploma", () => {
    expect(buildDiplomaFilename({ diplomaType: "general", role: "conferencista" })).toBe(
      "diploma-conferencista-general.pdf",
    );
  });

  it("prefixes the role for a moderador precongreso diploma", () => {
    expect(
      buildDiplomaFilename({
        diplomaType: "precongreso",
        role: "moderador",
        courseName: "Curso de IA",
      }),
    ).toBe("diploma-moderador-curso-de-ia.pdf");
  });
});
