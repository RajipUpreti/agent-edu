"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { AddOfficeCheckinDialog } from '@/features/office-checkins/components/add-office-checkin-dialog';
import { OfficeCheckinCard } from '@/features/office-checkins/components/office-checkin-card';
import { OfficeCheckinEmptyState } from '@/features/office-checkins/components/office-checkin-empty-state';
import { OfficeCheckinSection } from '@/features/office-checkins/components/office-checkin-section';
import {
  officeCheckinSectionOrder,
  type OfficeCheckinSectionKey,
} from '@/features/office-checkins/components/office-checkin-status-badge';
import { OfficeCheckinToolbar } from '@/features/office-checkins/components/office-checkin-toolbar';
import type {
  OfficeCheckin,
  OfficeCheckinDashboardQuery,
  OfficeCheckinGroupedBuckets,
  OfficeCheckinOptions,
  OfficeCheckinStatus,
} from '@/features/office-checkins/types';
import { useDebounce } from '@/features/office-checkins/use-debounce';
import {
  assignOfficeCheckinHost,
  getGroupedOfficeCheckins,
  updateOfficeCheckinStatus,
} from '@/lib/api/office-checkins';

type OfficeCheckinPageClientProps = {
  initialGrouped: OfficeCheckinGroupedBuckets;
  options: OfficeCheckinOptions;
  initialQuery: OfficeCheckinDashboardQuery;
};

function createEmptyGroupedBuckets(): OfficeCheckinGroupedBuckets {
  return {
    unassigned: [],
    waiting: [],
    attending: [],
    completed: [],
    cancelled: [],
  };
}

function toDateInputValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildQueryString(query: OfficeCheckinDashboardQuery) {
  const params = new URLSearchParams();

  if (query.branchId) {
    params.set('branchId', query.branchId);
  }

  if (query.date) {
    params.set('date', query.date);
  }

  if (query.search.trim()) {
    params.set('search', query.search.trim());
  }

  if (query.showCompleted) {
    params.set('showCompleted', 'true');
  }

  return params.toString();
}

const activeSectionKeys: OfficeCheckinSectionKey[] = ['unassigned', 'waiting', 'attending'];
const closedSectionKeys: OfficeCheckinSectionKey[] = ['completed', 'cancelled'];

function getSectionKeyFromStatus(status: OfficeCheckinStatus): OfficeCheckinSectionKey {
  if (status === 'UNASSIGNED') {
    return 'unassigned';
  }

  if (status === 'WAITING') {
    return 'waiting';
  }

  if (status === 'ATTENDING') {
    return 'attending';
  }

  if (status === 'COMPLETED') {
    return 'completed';
  }

  return 'cancelled';
}

function sortItems(items: OfficeCheckin[]) {
  return [...items].sort(
    (left, right) => new Date(left.checkedInAt).getTime() - new Date(right.checkedInAt).getTime(),
  );
}

function upsertGroupedItem(groups: OfficeCheckinGroupedBuckets, item: OfficeCheckin) {
  const next = createEmptyGroupedBuckets();

  for (const sectionKey of officeCheckinSectionOrder) {
    next[sectionKey] = groups[sectionKey].filter((entry) => entry.id !== item.id);
  }

  const targetKey = getSectionKeyFromStatus(item.status);
  next[targetKey] = sortItems([...next[targetKey], item]);

  return next;
}

function removeGroupedItem(groups: OfficeCheckinGroupedBuckets, id: string) {
  const next = createEmptyGroupedBuckets();

  for (const sectionKey of officeCheckinSectionOrder) {
    next[sectionKey] = groups[sectionKey].filter((entry) => entry.id !== id);
  }

  return next;
}

function searchMatches(item: OfficeCheckin, search: string) {
  const normalized = search.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [item.visitorName, item.visitorEmail, item.visitPurpose]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalized));
}

function queryMatches(item: OfficeCheckin, query: OfficeCheckinDashboardQuery) {
  if (query.branchId && item.branchId !== query.branchId) {
    return false;
  }

  if (query.date && toDateInputValue(item.checkedInAt) !== query.date) {
    return false;
  }

  if (!query.showCompleted && (item.status === 'COMPLETED' || item.status === 'CANCELLED')) {
    return false;
  }

  return searchMatches(item, query.search);
}

function getVisibleSectionKeys(
  groups: OfficeCheckinGroupedBuckets,
  showCompleted: boolean,
): OfficeCheckinSectionKey[] {
  const visibleActiveSections = activeSectionKeys.filter((sectionKey) => groups[sectionKey].length > 0);
  const visibleClosedSections = showCompleted
    ? closedSectionKeys.filter((sectionKey) => groups[sectionKey].length > 0)
    : [];

  return [...visibleActiveSections, ...visibleClosedSections];
}

export function OfficeCheckinPageClient({
  initialGrouped,
  options,
  initialQuery,
}: OfficeCheckinPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState<OfficeCheckinDashboardQuery>(initialQuery);
  const [grouped, setGrouped] = useState<OfficeCheckinGroupedBuckets>(initialGrouped);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [createFeedback, setCreateFeedback] = useState<string | null>(null);
  const [busyCheckinId, setBusyCheckinId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(query.search, 350);
  const fetchSequence = useRef(0);
  const didMountFetchRef = useRef(false);
  const didMountUrlRef = useRef(false);

  const selectedBranchHosts = useMemo(
    () =>
      options.hosts.filter((host) =>
        query.branchId ? host.branchId === query.branchId || host.branchId === null : true,
      ),
    [options.hosts, query.branchId],
  );

  const activeQuery = useMemo(
    () => ({ ...query, search: debouncedSearch }),
    [debouncedSearch, query],
  );

  const totals = useMemo(() => {
    const total = officeCheckinSectionOrder.reduce((count, key) => count + grouped[key].length, 0);
    const active = grouped.unassigned.length + grouped.waiting.length + grouped.attending.length;
    const completed = grouped.completed.length + grouped.cancelled.length;

    return { total, active, completed };
  }, [grouped]);

  const visibleSections = useMemo(
    () => getVisibleSectionKeys(grouped, query.showCompleted),
    [grouped, query.showCompleted],
  );

  const visibleSectionEntries = useMemo(
    () => visibleSections.map((sectionKey) => ({ sectionKey, items: grouped[sectionKey] })),
    [grouped, visibleSections],
  );

  const hasActiveSections = useMemo(
    () => activeSectionKeys.some((sectionKey) => grouped[sectionKey].length > 0),
    [grouped],
  );

  const hasAnyVisibleSections = visibleSectionEntries.some(({ items }) => items.length > 0);

  const emptyStateDescription = useMemo(() => {
    if (query.search.trim()) {
      return 'No check-ins match the current branch, date, and search filters.';
    }

    if (query.showCompleted && !hasActiveSections) {
      return 'There are no active or closed check-ins for this branch and date.';
    }

    return 'There are no active visitors in the queue for this branch and date.';
  }, [hasActiveSections, query.search, query.showCompleted]);

  const refreshDashboard = useCallback(
    async (nextQuery: OfficeCheckinDashboardQuery) => {
      const currentRequest = fetchSequence.current + 1;
      fetchSequence.current = currentRequest;
      setIsRefreshing(true);
      setDashboardError(null);

      try {
        const nextGrouped = await getGroupedOfficeCheckins({
          branchId: nextQuery.branchId || undefined,
          date: nextQuery.date,
          search: nextQuery.search,
          showCompleted: nextQuery.showCompleted,
          page: 1,
          limit: 150,
        });

        if (fetchSequence.current === currentRequest) {
          setGrouped(nextGrouped);
        }
      } catch (error) {
        if (fetchSequence.current === currentRequest) {
          setDashboardError(
            error instanceof Error ? error.message : 'Unable to refresh office check-ins.',
          );
        }
      } finally {
        if (fetchSequence.current === currentRequest) {
          setIsRefreshing(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!didMountFetchRef.current) {
      didMountFetchRef.current = true;
      return;
    }

    void refreshDashboard(activeQuery);
  }, [activeQuery, refreshDashboard]);

  useEffect(() => {
    const nextUrl = buildQueryString(activeQuery);

    if (!didMountUrlRef.current) {
      didMountUrlRef.current = true;
      return;
    }

    router.replace(nextUrl ? `${pathname}?${nextUrl}` : pathname, { scroll: false });
  }, [activeQuery, pathname, router]);

  useEffect(() => {
    if (!createFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCreateFeedback(null);
    }, 2400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [createFeedback]);

  const handleCreated = useCallback(
    async (created: OfficeCheckin) => {
      setDashboardError(null);
      setCreateFeedback('Check-in added successfully.');

      if (queryMatches(created, activeQuery)) {
        setGrouped((current) => upsertGroupedItem(current, created));
      }

      await refreshDashboard(activeQuery);
    },
    [activeQuery, refreshDashboard],
  );

  const handleAssignHost = useCallback(
    async (id: string, hostId: string | null) => {
      setBusyCheckinId(id);
      setDashboardError(null);

      try {
        const updated = await assignOfficeCheckinHost(id, hostId);
        if (queryMatches(updated, activeQuery)) {
          setGrouped((current) => upsertGroupedItem(current, updated));
        } else {
          setGrouped((current) => removeGroupedItem(current, updated.id));
        }
        await refreshDashboard(activeQuery);
      } catch (error) {
        setDashboardError(error instanceof Error ? error.message : 'Unable to assign host.');
      } finally {
        setBusyCheckinId(null);
      }
    },
    [activeQuery, refreshDashboard],
  );

  const handleApplyStatus = useCallback(
    async (id: string, status: OfficeCheckinStatus) => {
      setBusyCheckinId(id);
      setDashboardError(null);

      try {
        const updated = await updateOfficeCheckinStatus(id, status);
        if (queryMatches(updated, activeQuery)) {
          setGrouped((current) => upsertGroupedItem(current, updated));
        } else {
          setGrouped((current) => removeGroupedItem(current, updated.id));
        }
        await refreshDashboard(activeQuery);
      } catch (error) {
        setDashboardError(error instanceof Error ? error.message : 'Unable to update status.');
      } finally {
        setBusyCheckinId(null);
      }
    },
    [activeQuery, refreshDashboard],
  );

  return (
    <div className="space-y-6 min-h-[calc(100vh-10rem)]">
      <PageHeader
        title="Office Check-In"
        description="Track walk-ins, host assignment, and attendance flow for branch reception."
        actions={
          <AddOfficeCheckinDialog
            branchId={query.branchId}
            hosts={options.hosts}
            onCreated={handleCreated}
          />
        }
      />

      <OfficeCheckinToolbar
        options={options}
        query={query}
        totals={totals}
        isRefreshing={isRefreshing}
        searchSettled={debouncedSearch === query.search}
        onBranchChange={(branchId) => setQuery((current) => ({ ...current, branchId }))}
        onDateChange={(date) => setQuery((current) => ({ ...current, date }))}
        onSearchChange={(search) => setQuery((current) => ({ ...current, search }))}
        onShowCompletedChange={(showCompleted) =>
          setQuery((current) => ({ ...current, showCompleted }))
        }
      />

      {createFeedback ? (
        <div className="rounded-lg border border-emerald-300/50 bg-emerald-50/80 px-3.5 py-2.5 text-sm text-emerald-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_6px_18px_rgba(16,185,129,0.12)] backdrop-blur-sm">
          {createFeedback}
        </div>
      ) : null}

      {dashboardError ? (
        <div className="rounded-lg border border-rose-300/55 bg-rose-50/82 px-3.5 py-2.5 text-sm text-rose-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_18px_rgba(244,63,94,0.12)] backdrop-blur-sm">
          {dashboardError}
        </div>
      ) : null}

      {hasAnyVisibleSections ? (
        <div className="space-y-3">
          {visibleSectionEntries.map(({ sectionKey, items }) => (
            <OfficeCheckinSection
              key={sectionKey}
              sectionKey={sectionKey}
              count={items.length}
              isRefreshing={isRefreshing}
            >
              {items.map((item) => (
                <OfficeCheckinCard
                  key={item.id}
                  item={item}
                  hosts={selectedBranchHosts}
                  busy={busyCheckinId === item.id}
                  onAssignHost={(id, hostId) => {
                    void handleAssignHost(id, hostId);
                  }}
                  onApplyStatus={(id, status) => {
                    void handleApplyStatus(id, status);
                  }}
                />
              ))}
            </OfficeCheckinSection>
          ))}
        </div>
      ) : (
        <OfficeCheckinEmptyState
          title="No check-ins to show"
          description={emptyStateDescription}
          hint="Try changing branch, date, or search filters."
          centered
        />
      )}
    </div>
  );
}