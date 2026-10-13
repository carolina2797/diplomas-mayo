export type DiplomaType = "general" | "precongreso";
export type Role = "asistente" | "conferencista" | "moderador";

export interface DiplomaData {
  attendeeName: string;
  prefix?: string | null;
  diplomaType: DiplomaType;
  role: Role;
  courseCode?: string;
  courseName?: string;
}
