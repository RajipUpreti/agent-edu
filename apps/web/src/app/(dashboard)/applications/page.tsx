import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ApplicationsPipeline } from "@/features/applications/components/applications-pipeline";
import { getApplications } from "@/lib/api/applications";

type ApplicationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const params = await searchParams;
  const search = readParam(params.search) ?? "";
  const status = readParam(params.status) ?? "ALL";
  const priority = readParam(params.priority) ?? "ALL";
  const sortBy = readParam(params.sortBy) ?? "createdAt";
  const sortOrder = readParam(params.sortOrder) ?? "desc";
  const page = Math.max(1, Number(readParam(params.page) ?? "1") || 1);
  const limit = 20;

  const result = await getApplications({
    search,
    status: status === "ALL" ? undefined : status,
    priority: priority === "ALL" ? undefined : priority,
    sortBy:
      sortBy === "status" || sortBy === "priority" || sortBy === "createdAt"
        ? sortBy
        : "createdAt",
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
    page,
    limit,
  })
    .then((applications) => ({ applications, error: null }))
    .catch((error: unknown) => ({ applications: null, error }));

  if (result.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Applications" description="Manage student applications." />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load applications from the backend API."
          }
          actionLabel="Try Again"
          actionHref="/applications"
        />
      </div>
    );
  }

  const applications = result.applications ?? [];

  const pipelineBuckets = {
    Draft: ["DRAFT", "IN_PROGRESS"],
    Submitted: ["SUBMITTED"],
    "Under Review": ["OFFER_RECEIVED", "OFFER_ACCEPTED", "OFFER_REJECTED", "TUITION_PENDING", "COE_PENDING"],
    "Offer Received": ["COE_RECEIVED", "VISA_IN_PROGRESS"],
    "Visa Stage": ["VISA_GRANTED", "VISA_REJECTED", "ENROLLED", "CLOSED"],
  } as const;

  const bucketEntries = Object.entries(pipelineBuckets) as Array<[
    keyof typeof pipelineBuckets,
    readonly string[],
  ]>;

  const applicationsByBucket = bucketEntries.reduce<Record<string, typeof applications>>(
    (acc, [bucketLabel, statuses]) => {
      acc[bucketLabel] = applications.filter((app) => statuses.includes(app.status));
      return acc;
    },
    {} as Record<string, typeof applications>,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Tracker"
        description="Track applications in kanban and list views with KPI analytics."
        actions={
          <Link href="/applications/new" className="inline-flex">
            <Button>New Application</Button>
          </Link>
        }
      />

      <ApplicationsPipeline initialApplications={applications} />
    </div>
  );
}

