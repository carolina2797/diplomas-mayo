import type { DiplomaType } from "./types";

export function buildDiplomaDownloadUrl(params: {
  email: string;
  type: DiplomaType;
  prefix?: string | null;
}): string {
  const search = new URLSearchParams({ email: params.email, tipo: params.type });
  if (params.prefix) {
    search.set("prefijo", params.prefix);
  }
  return `/api/diploma/download?${search.toString()}`;
}
