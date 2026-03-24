import { PageHeader } from "@/components/shared/page-header";
import { ApplicationForm } from "@/features/applications/components/application-form";

export default function NewApplicationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Application"
        description="Create an application from an existing student record."
      />
      <ApplicationForm mode="create" />
    </div>
  );
}
