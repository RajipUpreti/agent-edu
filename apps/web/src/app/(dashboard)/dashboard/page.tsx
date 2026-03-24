import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getContacts } from "@/lib/api/contacts";
import { getStudents } from "@/lib/api/students";
import { getApplications } from "@/lib/api/applications";
import { getDocuments } from "@/lib/api/documents";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const [contacts, students, applications, documents] = await Promise.all([
    getContacts({ page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" }).catch(() => []),
    getStudents({ page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" }).catch(() => []),
    getApplications({ page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" }).catch(() => []),
    getDocuments().catch(() => []),
  ]);

  const totalContacts = contacts.length;
  const totalStudents = students.length;
  const totalApplications = applications.length;
  const totalDocuments = documents.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultancy Overview"
        description="Live data from the database is shown below."
        actions={
          <div>
            <Link href="/applications/new">
              <Button>New Application</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Contacts</p>
            <p className="text-3xl font-bold text-slate-900">{totalContacts}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Students</p>
            <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Applications</p>
            <p className="text-3xl font-bold text-slate-900">{totalApplications}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Documents</p>
            <p className="text-3xl font-bold text-slate-900">{totalDocuments}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
