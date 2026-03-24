import { notFound } from "next/navigation";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { getApplicationById } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/http";

type EditApplicationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditApplicationPage({ params }: EditApplicationPageProps) {
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
        <PageHeader title="Edit Application" description="Update application details." />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load this application for editing."
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
      <PageHeader title="Edit Application" description="Update stage and progress details." />
      <ApplicationForm
        mode="edit"
        applicationId={application.id}
        initialValues={application}
      />
    </div>
  );
}
