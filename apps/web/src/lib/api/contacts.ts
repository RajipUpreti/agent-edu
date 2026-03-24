import { requestJson } from "@/lib/api/http";
import type {
  Contact,
  CreateContactInput,
  UpdateContactInput,
} from "@/features/contacts/types";

export type GetContactsParams = {
  search?: string;
  status?: string;
  sortBy?: "createdAt" | "firstName";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export async function getContacts(params: GetContactsParams = {}) {
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.status) {
    query.set("status", params.status);
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

  return requestJson<Contact[]>(`/contacts${suffix ? `?${suffix}` : ""}`, {
    cache: "no-store",
  });
}

export async function getContactById(id: string) {
  return requestJson<Contact>(`/contacts/${id}`, {
    cache: "no-store",
  });
}

export async function createContact(input: CreateContactInput) {
  return requestJson<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateContact(id: string, input: UpdateContactInput) {
  return requestJson<Contact>(`/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteContact(id: string) {
  return requestJson<Contact>(`/contacts/${id}`, {
    method: "DELETE",
  });
}
