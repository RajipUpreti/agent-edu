"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DataTableWrapper } from "@/components/shared/data-table-wrapper";
import { DeleteEntityButton } from "@/components/shared/delete-entity-button";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APPLICATION_STATUSES,
  PRIORITIES,
  type Application,
} from "@/features/applications/types";

type ApplicationsListProps = {
  applications: Application[];
  query: {
    search: string;
    status: string;
    priority: string;
    sortBy: string;
    sortOrder: string;
    page: number;
    limit: number;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function ApplicationsList({ applications: initialApplications, query }: ApplicationsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchInput, setSearchInput] = useState<string>(query.search);
  const hasNextPage = applications.length >= query.limit;

  const sortValue = useMemo(() => {
    if (query.sortBy === "createdAt" && query.sortOrder === "asc") {
      return "created-asc";
    }

    if (query.sortBy === "status" && query.sortOrder === "asc") {
      return "status-asc";
    }

    if (query.sortBy === "priority" && query.sortOrder === "asc") {
      return "priority-asc";
    }

    return "created-desc";
  }, [query.sortBy, query.sortOrder]);

  const pushQuery = (updates: Partial<Record<string, string>>) => {
    const params = new URLSearchParams();

    const next = {
      search: query.search,
      status: query.status,
      priority: query.priority,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: String(query.page),
      ...updates,
    };

    if (next.search.trim()) {
      params.set("search", next.search.trim());
    }

    if (next.status && next.status !== "ALL") {
      params.set("status", next.status);
    }

    if (next.priority && next.priority !== "ALL") {
      params.set("priority", next.priority);
    }

    if (next.sortBy && next.sortBy !== "createdAt") {
      params.set("sortBy", next.sortBy);
    }

    if (next.sortOrder && next.sortOrder !== "desc") {
      params.set("sortOrder", next.sortOrder);
    }

    if (next.page !== "1") {
      params.set("page", next.page);
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  if (applications.length === 0 && query.page === 1) {
    return (
      <EmptyState
        title="No applications yet"
        description="Create the first application to begin tracking admission stages."
        actionLabel="Create Application"
        actionHref="/applications/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        className="md:grid-cols-[minmax(0,1.3fr)_minmax(0,2.2fr)]"
        onSubmit={(event) => {
          event.preventDefault();
          pushQuery({ search: searchInput, page: "1" });
        }}
        searchSlot={
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search app no, student, institution"
          />
        }
        filtersSlot={
          <>
            <Select
              value={query.status}
              onChange={(event) => pushQuery({ status: event.target.value, page: "1" })}
            >
              <option value="ALL">All Statuses</option>
              {APPLICATION_STATUSES.map((applicationStatus) => (
                <option key={applicationStatus} value={applicationStatus}>
                  {applicationStatus}
                </option>
              ))}
            </Select>

            <Select
              value={query.priority}
              onChange={(event) => pushQuery({ priority: event.target.value, page: "1" })}
            >
              <option value="ALL">All Priorities</option>
              {PRIORITIES.map((applicationPriority) => (
                <option key={applicationPriority} value={applicationPriority}>
                  {applicationPriority}
                </option>
              ))}
            </Select>

            <Select
              value={sortValue}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "created-asc") {
                  pushQuery({ sortBy: "createdAt", sortOrder: "asc", page: "1" });
                  return;
                }

                if (value === "status-asc") {
                  pushQuery({ sortBy: "status", sortOrder: "asc", page: "1" });
                  return;
                }

                if (value === "priority-asc") {
                  pushQuery({ sortBy: "priority", sortOrder: "asc", page: "1" });
                  return;
                }

                pushQuery({ sortBy: "createdAt", sortOrder: "desc", page: "1" });
              }}
            >
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="status-asc">Status A-Z</option>
              <option value="priority-asc">Priority A-Z</option>
            </Select>
          </>
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          title="No matching applications"
          description="Try different search, filter, or sort values."
        />
      ) : (
        <DataTableWrapper
          title="Application List"
          description="Most recent applications with status and priority."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.applicationNumber ?? application.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{application.institution?.name ?? application.institutionId}</TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>{application.priority}</TableCell>
                  <TableCell>{formatDate(application.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex flex-wrap items-center justify-end gap-2">
                      <Link href={`/applications/${application.id}`} className="inline-flex">
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </Link>
                      <Link href={`/applications/${application.id}/edit`} className="inline-flex">
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      </Link>
                      <DeleteEntityButton
                        resourceLabel="Application"
                        endpoint={`/applications/${application.id}`}
                        size="sm"
                        onDeleted={() => {
                          setApplications((prev) => prev.filter((item) => item.id !== application.id));
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableWrapper>
      )}

      <div className="flex items-center justify-between">
        <p className="glass-badge rounded-full px-3 py-1 text-sm text-muted">Page {query.page}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={query.page <= 1}
            onClick={() => pushQuery({ page: String(Math.max(1, query.page - 1)) })}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={!hasNextPage}
            onClick={() => pushQuery({ page: String(query.page + 1) })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
