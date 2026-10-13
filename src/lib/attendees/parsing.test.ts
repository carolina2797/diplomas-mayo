import { describe, it, expect } from "vitest";
import { parseAttendees, parseCourses, normalizeEmail } from "./parsing";

describe("normalizeEmail", () => {
  it("trims whitespace and lowercases the email", () => {
    expect(normalizeEmail("  Ana.Perez@Correo.com  ")).toBe("ana.perez@correo.com");
  });
});

describe("parseAttendees", () => {
  it("parses data rows, skipping the header", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      ["ana@correo.com", "Ana Pérez", "PC1", "", "moderador"],
      ["luis@correo.com", "Luis Gómez", "", "", ""],
    ];

    expect(parseAttendees(rows)).toEqual([
      {
        email: "ana@correo.com",
        name: "Ana Pérez",
        precongressCode: "PC1",
        generalRole: "asistente",
        precongressRole: "moderador",
      },
      {
        email: "luis@correo.com",
        name: "Luis Gómez",
        precongressCode: null,
        generalRole: "asistente",
        precongressRole: "asistente",
      },
    ]);
  });

  it("normalizes email casing/whitespace", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      ["  Ana@Correo.com ", "Ana Pérez", "PC1", "", ""],
    ];

    expect(parseAttendees(rows)[0].email).toBe("ana@correo.com");
  });

  it("treats a missing precongress column as no precongreso", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      ["luis@correo.com", "Luis Gómez"],
    ];

    expect(parseAttendees(rows)[0].precongressCode).toBeNull();
  });

  it("skips rows without an email", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      ["", "Fila vacía", "", "", ""],
      ["ana@correo.com", "Ana Pérez", "", "", ""],
    ];

    expect(parseAttendees(rows)).toHaveLength(1);
  });

  it("returns an empty array when there are no data rows", () => {
    expect(
      parseAttendees([["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"]]),
    ).toEqual([]);
  });

  it("skips completely empty rows (no columns at all)", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      [],
      ["ana@correo.com", "Ana Pérez", "", "", ""],
    ];

    expect(parseAttendees(rows)).toHaveLength(1);
  });

  it("treats a missing name column as an empty name", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      ["ana@correo.com"],
    ];

    expect(parseAttendees(rows)[0].name).toBe("");
  });

  it.each(["asistente", "conferencista", "moderador", "CONFERENCISTA", " Moderador "])(
    "accepts %s as a valid role (case/whitespace-insensitive)",
    (value) => {
      const rows = [
        ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
        ["ana@correo.com", "Ana Pérez", "", value, ""],
      ];
      expect(parseAttendees(rows)[0].generalRole).toBe(value.trim().toLowerCase());
    },
  );

  it.each(["", "profesor", "invitado", "x"])(
    "defaults to asistente for blank/unrecognized role values (%s)",
    (value) => {
      const rows = [
        ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
        ["ana@correo.com", "Ana Pérez", "", value, ""],
      ];
      expect(parseAttendees(rows)[0].generalRole).toBe("asistente");
    },
  );

  it.each(["Ninguno", "NINGUNO", " no aplica ", "N/A", "no"])(
    "treats %s in RolGeneral as no general diploma at all (null)",
    (value) => {
      const rows = [
        ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
        ["pedro@correo.com", "Pedro Lima", "PC4", value, "moderador"],
      ];
      const attendee = parseAttendees(rows)[0];
      expect(attendee.generalRole).toBeNull();
      expect(attendee.precongressRole).toBe("moderador");
    },
  );

  it("does not treat 'Ninguno' in RolPrecongreso specially (it's not a valid role, so it defaults to asistente)", () => {
    const rows = [
      ["Correo", "Nombre", "CodigoPrecongreso", "RolGeneral", "RolPrecongreso"],
      ["ana@correo.com", "Ana Pérez", "PC1", "", "Ninguno"],
    ];
    expect(parseAttendees(rows)[0].precongressRole).toBe("asistente");
  });
});

describe("parseCourses", () => {
  it("parses data rows, skipping the header", () => {
    const rows = [
      ["CodigoPrecongreso", "NombreCompletoCurso"],
      ["PC1", "Precongreso de Curso 1"],
      ["PC2", "Precongreso de Curso 2"],
    ];

    expect(parseCourses(rows)).toEqual([
      { code: "PC1", name: "Precongreso de Curso 1" },
      { code: "PC2", name: "Precongreso de Curso 2" },
    ]);
  });

  it("skips rows without a code", () => {
    const rows = [
      ["CodigoPrecongreso", "NombreCompletoCurso"],
      ["", "Fila vacía"],
      ["PC1", "Precongreso de Curso 1"],
    ];

    expect(parseCourses(rows)).toHaveLength(1);
  });

  it("skips completely empty rows (no columns at all)", () => {
    const rows = [
      ["CodigoPrecongreso", "NombreCompletoCurso"],
      [],
      ["PC1", "Precongreso de Curso 1"],
    ];

    expect(parseCourses(rows)).toHaveLength(1);
  });

  it("treats a missing name column as an empty name", () => {
    const rows = [
      ["CodigoPrecongreso", "NombreCompletoCurso"],
      ["PC1"],
    ];

    expect(parseCourses(rows)[0].name).toBe("");
  });
});
