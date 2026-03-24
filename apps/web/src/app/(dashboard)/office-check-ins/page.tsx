import { ErrorState } from '@/components/shared/error-state';
import { OfficeCheckinPageClient } from '@/features/office-checkins/components/office-checkin-page-client';
import { getGroupedOfficeCheckins, getOfficeCheckinOptions } from '@/lib/api/office-checkins';

type OfficeCheckinsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function todayDateInput() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function OfficeCheckinsPage({ searchParams }: OfficeCheckinsPageProps) {
  const params = await searchParams;
  const branchIdFromQuery = readParam(params.branchId) ?? '';
  const date = readParam(params.date) ?? todayDateInput();
  const search = readParam(params.search) ?? '';
  const showCompleted = readParam(params.showCompleted) === 'true';

  const optionsResult = await getOfficeCheckinOptions()
    .then((options) => ({ options, error: null }))
    .catch((error: unknown) => ({ options: null, error }));

  if (optionsResult.error) {
    const error = optionsResult.error;

    return (
      <div className="space-y-6">
        <ErrorState
          description={
            error instanceof Error
              ? error.message
              : 'Could not load office check-in data from the backend API.'
          }
          actionLabel="Try Again"
          actionHref="/office-check-ins"
        />
      </div>
    );
  }

  const options = optionsResult.options ?? { branches: [], hosts: [] };
  const effectiveBranchId = branchIdFromQuery || options.branches[0]?.id || '';

  const groupedResult = await getGroupedOfficeCheckins({
    branchId: effectiveBranchId || undefined,
    date,
    search,
    showCompleted,
    page: 1,
    limit: 150,
  })
    .then((grouped) => ({ grouped, error: null }))
    .catch((error: unknown) => ({ grouped: null, error }));

  if (groupedResult.error) {
    const error = groupedResult.error;

    return (
      <div className="space-y-6">
        <ErrorState
          description={
            error instanceof Error
              ? error.message
              : 'Could not load office check-in data from the backend API.'
          }
          actionLabel="Try Again"
          actionHref="/office-check-ins"
        />
      </div>
    );
  }

  const grouped = groupedResult.grouped ?? {
    unassigned: [],
    waiting: [],
    attending: [],
    completed: [],
    cancelled: [],
  };

  return (
    <div className="space-y-6 pb-8">
      <OfficeCheckinPageClient
        initialGrouped={grouped}
        options={options}
        initialQuery={{
          branchId: effectiveBranchId,
          date,
          search,
          showCompleted,
        }}
      />
    </div>
  );
}
