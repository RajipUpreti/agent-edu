import { requestJson } from "@/lib/api/http";

export type DocumentRecord = {
  id: string;
  title: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  documentType?: { name: string };
  uploadedBy?: { firstName: string; lastName?: string };
  student?: { firstName: string; lastName?: string };
  application?: { applicationNumber?: string };
};

export async function getDocuments(status?: string) {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  return requestJson<DocumentRecord[]>(`/documents${query.toString() ? `?${query.toString()}` : ""}`, {
    cache: "no-store",
  });
}

export async function createDocument(data: {
  title: string;
  fileName: string;
  filePath: string;
  mimeType?: string;
  fileSize?: number;
  status?: string;
}) {
  return requestJson<DocumentRecord>("/documents", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
