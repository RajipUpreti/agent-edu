import { requestJson } from "@/lib/api/http";

export type InstitutionLookup = {
  id: string;
  name: string;
  code: string | null;
  country: string;
  type: string;
};

export async function searchInstitutions(search?: string, limit = 20) {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  params.set("limit", String(limit));

  const queryString = params.toString();
  return requestJson<InstitutionLookup[]>(`/institutions${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
  });
}
