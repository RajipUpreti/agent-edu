import { requestJson } from "@/lib/api/http";
import type {
  CreateStudentInput,
  Student,
  UpdateStudentInput,
} from "@/features/students/types";

export type GetStudentsParams = {
  search?: string;
  sortBy?: "createdAt" | "firstName";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export async function getStudents(params: GetStudentsParams = {}) {
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
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

  return requestJson<Student[]>(`/students${suffix ? `?${suffix}` : ""}`, {
    cache: "no-store",
  });
}

export async function getStudentById(id: string) {
  return requestJson<Student>(`/students/${id}`, {
    cache: "no-store",
  });
}

export async function createStudent(input: CreateStudentInput) {
  return requestJson<Student>("/students", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateStudent(id: string, input: UpdateStudentInput) {
  return requestJson<Student>(`/students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteStudent(id: string) {
  return requestJson<Student>(`/students/${id}`, {
    method: "DELETE",
  });
}
