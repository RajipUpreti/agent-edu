import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEntityButton } from "@/components/shared/delete-entity-button";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StudentProfileTabs } from "@/app/(dashboard)/students/student-profile-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/http";
import { getStudentById } from "@/lib/api/students";

type StudentDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatOptionalDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;

  const result = await getStudentById(id)
    .then((student) => ({ student, error: null }))
    .catch((error: unknown) => ({ student: null, error }));

  if (result.error) {
    if (result.error instanceof ApiError && result.error.status === 404) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <PageHeader title="Student" description="Student profile" />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load this student from the backend API."
          }
          actionLabel="Back to Students"
          actionHref="/students"
        />
      </div>
    );
  }

  const student = result.student;

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${student.firstName} ${student.lastName ?? ""}`.trim()}
        description="Student profile and progression context"
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/students/${student.id}/edit`} className="inline-flex">
              <Button>Edit Student</Button>
            </Link>
            <DeleteEntityButton
              resourceLabel="Student"
              endpoint={`/students/${student.id}`}
              redirectHref="/students"
            />
          </div>
        }
      />

      <section className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
              <div className="h-24 w-24 rounded-2xl border border-slate-200 bg-slate-100" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{student.firstName} {student.lastName ?? ""}</h3>
                <p className="text-sm text-slate-500">Student profile overview and progression context</p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-700">{student.email ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-700">{student.phone ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Contact status</p>
                    <p className="text-sm font-medium text-slate-700">{student.contact?.status ?? "--"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Since</p>
                    <p className="text-sm font-medium text-slate-700">{formatOptionalDate(student.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-50 border border-slate-200 shadow-sm">
            <div className="p-6 space-y-3">
              <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Quick stats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <p className="text-xs uppercase text-slate-400">Applications</p>
                  <p className="font-bold text-slate-800">{student.contact ? 6 : 0}</p>
                </div>
                <div className="rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <p className="text-xs uppercase text-slate-400">Engagements</p>
                  <p className="font-bold text-slate-800">{student.contact ? 3 : 0}</p>
                </div>
                <div className="rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <p className="text-xs uppercase text-slate-400">Tasks</p>
                  <p className="font-bold text-slate-800">{student.contact ? 2 : 0}</p>
                </div>
                <div className="rounded-lg bg-white px-3 py-2 border border-slate-200">
                  <p className="text-xs uppercase text-slate-400">Notes</p>
                  <p className="font-bold text-slate-800">{student.contact ? 8 : 0}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <StudentProfileTabs student={student} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Summary">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Linked Contact: </span>
              {student.contact ? (
                <Link
                  href={`/contacts/${student.contact.id}`}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {student.contact.firstName} {student.contact.lastName ?? ""}
                </Link>
              ) : (
                student.contactId
              )}
            </p>
            <p>
              <span className="font-medium">Created At: </span>
              {formatDate(student.createdAt)}
            </p>
            <p>
              <span className="font-medium">Updated At: </span>
              {formatDate(student.updatedAt)}
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Personal Details">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email: </span>
              {student.email ?? "-"}
            </p>
            <p>
              <span className="font-medium">Phone: </span>
              {student.phone ?? "-"}
            </p>
            <p>
              <span className="font-medium">Gender: </span>
              {student.gender ?? "-"}
            </p>
            <p>
              <span className="font-medium">Date of Birth: </span>
              {formatOptionalDate(student.dateOfBirth)}
            </p>
            <p>
              <span className="font-medium">Nationality: </span>
              {student.nationality ?? "-"}
            </p>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Academic Details">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Highest Qualification: </span>
              {student.highestQualification ?? "-"}
            </p>
            <p>
              <span className="font-medium">Graduation Year: </span>
              {student.graduationYear ?? "-"}
            </p>
            <p>
              <span className="font-medium">Current Occupation: </span>
              {student.currentOccupation ?? "-"}
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Passport and Notes">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Passport Number: </span>
              {student.passportNumber ?? "-"}
            </p>
            <p>
              <span className="font-medium">Passport Expiry: </span>
              {formatOptionalDate(student.passportExpiry)}
            </p>
            <p>
              <span className="font-medium">Remarks: </span>
              {student.remarks?.trim() ? student.remarks : "No remarks added yet."}
            </p>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
