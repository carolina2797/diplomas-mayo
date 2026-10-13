import { describe, it, expect } from "vitest";
import { findDiplomas } from "./matching";
import type { Attendee, Course } from "./types";

const courses: Course[] = [
  { code: "PC1", name: "Precongreso de Curso 1" },
  { code: "PC2", name: "Precongreso de Curso 2" },
  { code: "PC4", name: "Precongreso de Curso 4" },
];

const attendees: Attendee[] = [
  {
    email: "ana@correo.com",
    name: "Ana Pérez",
    precongressCode: "PC1",
    generalRole: "asistente",
    precongressRole: "asistente",
  },
  {
    email: "luis@correo.com",
    name: "Luis Gómez",
    precongressCode: null,
    generalRole: "asistente",
    precongressRole: "asistente",
  },
  {
    email: "eva@correo.com",
    name: "Eva Ruiz",
    precongressCode: "PC9",
    generalRole: "asistente",
    precongressRole: "asistente",
  },
  {
    email: "carlos@correo.com",
    name: "Carlos Díaz",
    precongressCode: null,
    generalRole: "conferencista",
    precongressRole: "asistente",
  },
  {
    email: "marta@correo.com",
    name: "Marta Solís",
    precongressCode: "PC2",
    generalRole: "asistente",
    precongressRole: "moderador",
  },
  {
    email: "pedro@correo.com",
    name: "Pedro Lima",
    precongressCode: "PC4",
    generalRole: null,
    precongressRole: "moderador",
  },
];

describe("findDiplomas", () => {
  it("returns general + precongreso diplomas for an attendee with a course", () => {
    const result = findDiplomas("ana@correo.com", attendees, courses);

    expect(result).toEqual({
      attendee: attendees[0],
      diplomas: [
        { diplomaType: "general", role: "asistente" },
        {
          diplomaType: "precongreso",
          role: "asistente",
          courseCode: "PC1",
          courseName: "Precongreso de Curso 1",
        },
      ],
    });
  });

  it("returns only the general diploma for an attendee without a precongreso", () => {
    const result = findDiplomas("luis@correo.com", attendees, courses);

    expect(result).toEqual({
      attendee: attendees[1],
      diplomas: [{ diplomaType: "general", role: "asistente" }],
    });
  });

  it("matches emails case-insensitively and ignoring whitespace", () => {
    const result = findDiplomas("  ANA@Correo.com  ", attendees, courses);
    expect(result?.attendee.email).toBe("ana@correo.com");
  });

  it("returns null when the email is not found", () => {
    expect(findDiplomas("nadie@correo.com", attendees, courses)).toBeNull();
  });

  it("falls back to the raw code if the precongreso is not in the catalog", () => {
    const result = findDiplomas("eva@correo.com", attendees, courses);
    expect(result?.diplomas[1]).toEqual({
      diplomaType: "precongreso",
      role: "asistente",
      courseCode: "PC9",
      courseName: "PC9",
    });
  });

  it("uses the general role even without a precongreso (e.g. conferencista of the congress itself)", () => {
    const result = findDiplomas("carlos@correo.com", attendees, courses);

    expect(result?.diplomas).toEqual([{ diplomaType: "general", role: "conferencista" }]);
  });

  it("allows a different role per event (asistente in general, moderador in precongreso)", () => {
    const result = findDiplomas("marta@correo.com", attendees, courses);

    expect(result?.diplomas).toEqual([
      { diplomaType: "general", role: "asistente" },
      {
        diplomaType: "precongreso",
        role: "moderador",
        courseCode: "PC2",
        courseName: "Precongreso de Curso 2",
      },
    ]);
  });

  it("omits the general diploma entirely when generalRole is null", () => {
    const result = findDiplomas("pedro@correo.com", attendees, courses);

    expect(result?.diplomas).toEqual([
      {
        diplomaType: "precongreso",
        role: "moderador",
        courseCode: "PC4",
        courseName: "Precongreso de Curso 4",
      },
    ]);
  });
});
