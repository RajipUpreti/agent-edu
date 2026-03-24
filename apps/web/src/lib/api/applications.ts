import { requestJson } from "@/lib/api/http";
import type {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/features/applications/types";

export type GetApplicationsParams = {
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: "createdAt" | "status" | "priority";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export async function getApplications(params: GetApplicationsParams = {}) {
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.priority) {
    query.set("priority", params.priority);
  }

  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    query.set("sortOrder", params.sortOrder);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  const suffix = query.toString();

  return requestJson<Application[]>(`/applications${suffix ? `?${suffix}` : ""}`, {
    cache: "no-store",
  });
}

export async function getApplicationById(id: string) {
  return requestJson<Application>(`/applications/${id}`, {
    cache: "no-store",
  });
}

export async function createApplication(input: CreateApplicationInput) {
  return requestJson<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateApplication(id: string, input: UpdateApplicationInput) {
  return requestJson<Application>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteApplication(id: string) {
  return requestJson<Application>(`/applications/${id}`, {
    method: "DELETE",
  });
}
