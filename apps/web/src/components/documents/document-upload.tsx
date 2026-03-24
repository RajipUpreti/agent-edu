"use client";

import { useState } from "react";
import { createDocument } from "@/lib/api/documents";
import { useRouter } from "next/navigation";

type DocumentOwnerType = "STUDENT" | "APPLICATION" | "CONTACT";

export function DocumentUpload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [ownerType, setOwnerType] = useState<DocumentOwnerType>("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || !title.trim()) {
      setError("Title and file are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const body = {
        title: title.trim(),
        fileName: file.name,
        filePath: `/upload/${file.name}`,
        mimeType: file.type,
        fileSize: file.size,
        ownerType,
      };

      await createDocument(body);
      setTitle("");
      setFile(null);
      setOwnerType("STUDENT");
      router.refresh();
    } catch (err) {
      setError("Could not upload document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          className="rounded-lg border border-slate-300 px-3 py-2 w-full"
          disabled={saving}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="rounded-lg border border-slate-300 px-3 py-2 w-full"
          disabled={saving}
        />
        <select
          value={ownerType}
          onChange={(e) => setOwnerType(e.target.value as DocumentOwnerType)}
          className="rounded-lg border border-slate-300 px-3 py-2 w-full"
          disabled={saving}
        >
          <option value="STUDENT">Student</option>
          <option value="APPLICATION">Application</option>
          <option value="CONTACT">Contact</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-white font-semibold hover:bg-blue-700"
        >
          {saving ? "Uploading..." : "Upload"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
