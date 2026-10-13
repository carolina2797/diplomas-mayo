export type Role = "asistente" | "conferencista" | "moderador";

export interface Attendee {
  email: string;
  name: string;
  precongressCode: string | null;
  /** null means this attendee does not receive a general-congress diploma at all. */
  generalRole: Role | null;
  precongressRole: Role;
}

export interface Course {
  code: string;
  name: string;
}

export type DiplomaType = "general" | "precongreso";

export interface DiplomaEntry {
  diplomaType: DiplomaType;
  role: Role;
  courseCode?: string;
  courseName?: string;
}

export interface AttendeeLookupResult {
  attendee: Attendee;
  diplomas: DiplomaEntry[];
}
