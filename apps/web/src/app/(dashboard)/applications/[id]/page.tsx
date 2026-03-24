import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEntityButton } from "@/components/shared/delete-entity-button";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/http";
import { getApplicationById } from "@/lib/api/applications";

type ApplicationDetailPageProps = {
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

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;

  const result = await getApplicationById(id)
    .then((application) => ({ application, error: null }))
    .catch((error: unknown) => ({ application: null, error }));

  if (result.error) {
    if (result.error instanceof ApiError && result.error.status === 404) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <PageHeader title="Application" description="Application profile" />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load this application from the backend API."
          }
          actionLabel="Back to Applications"
          actionHref="/applications"
        />
      </div>
    );
  }

  const application = result.application;

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={application.applicationNumber ?? `Application ${application.id.slice(0, 8)}`}
        description="Application details and stage context"
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/applications/${application.id}/edit`} className="inline-flex">
              <Button>Edit Application</Button>
            </Link>
            <DeleteEntityButton
              resourceLabel="Application"
              endpoint={`/applications/${application.id}`}
              redirectHref="/applications"
            />
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Status and Priority">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Status: </span>
              <StatusBadge status={application.status} />
            </p>
            <p>
              <span className="font-medium">Priority: </span>
              {application.priority}
            </p>
            <p>
              <span className="font-medium">Applied At: </span>
              {formatOptionalDate(application.appliedAt)}
            </p>
            <p>
              <span className="font-medium">Submitted At: </span>
              {formatOptionalDate(application.submittedAt)}
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Linked Entities">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Student: </span>
              {application.student ? (
                <Link
                  href={`/students/${application.student.id}`}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {application.student.firstName} {application.student.lastName ?? ""}
                </Link>
              ) : (
                application.studentId
              )}
            </p>
            <p>
              <span className="font-medium">Institution: </span>
              {application.institution?.name ?? application.institutionId}
            </p>
            <p>
              <span className="font-medium">Course ID: </span>
              {application.courseId ?? "-"}
            </p>
            <p>
              <span className="font-medium">Intake ID: </span>
              {application.intakeId ?? "-"}
            </p>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Timeline">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Created At: </span>
              {formatDate(application.createdAt)}
            </p>
            <p>
              <span className="font-medium">Updated At: </span>
              {formatDate(application.updatedAt)}
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Remarks">
          <p className="text-sm text-muted">
            {application.remarks?.trim() ? application.remarks : "No remarks added yet."}
          </p>
        </SectionCard>
      </section>
    </div>
  );
}
