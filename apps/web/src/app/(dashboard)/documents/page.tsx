import { getDocuments } from "@/lib/api/documents";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUpload } from "@/components/documents/document-upload";

export default async function DocumentsRepositoryPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Repository"
        description="Centralized knowledge hub for all consultancy documents."
        actions={
          <DocumentUpload />
        }
      />

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center text-slate-500">
          Document repository is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {documents.slice(0, 8).map((doc) => (
            <Card key={doc.id} className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-2">
                <p className="text-sm font-bold text-slate-900 truncate">{doc.title}</p>
                <p className="text-xs text-slate-500 truncate">{doc.fileName}</p>
                <p className="text-xs text-slate-500">{doc.mimeType ?? 'Unknown'} · {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}</p>
                <p className="text-[10px] text-slate-400">{new Date(doc.updatedAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">{doc.title}</td>
                  <td className="px-4 py-3">{doc.mimeType ?? 'N/A'}</td>
                  <td className="px-4 py-3">{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'Unknown'}</td>
                  <td className="px-4 py-3">{new Date(doc.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{doc.uploadedBy ? `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName ?? ''}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
