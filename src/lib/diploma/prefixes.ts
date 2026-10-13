export const TREATMENT_PREFIXES = ["Dr.", "Dra.", "Lic.", "Licda."] as const;

export type TreatmentPrefix = (typeof TREATMENT_PREFIXES)[number];

export function isValidPrefix(value: string | null | undefined): value is TreatmentPrefix {
  return (TREATMENT_PREFIXES as readonly (string | null | undefined)[]).includes(value);
}
