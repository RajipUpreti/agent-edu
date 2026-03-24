"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DataTableWrapper } from "@/components/shared/data-table-wrapper";
import { DeleteEntityButton } from "@/components/shared/delete-entity-button";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
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
import type { Student } from "@/features/students/types";

type StudentsListProps = {
  students: Student[];
  query: {
    search: string;
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

export function StudentsList({ students: initialStudents, query }: StudentsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchInput, setSearchInput] = useState<string>(query.search);
  const hasNextPage = students.length >= query.limit;

  const sortValue = useMemo(() => {
    if (query.sortBy === "firstName" && query.sortOrder === "asc") {
      return "name-asc";
    }

    if (query.sortBy === "firstName" && query.sortOrder === "desc") {
      return "name-desc";
    }

    if (query.sortBy === "createdAt" && query.sortOrder === "asc") {
      return "created-asc";
    }

    return "created-desc";
  }, [query.sortBy, query.sortOrder]);

  const pushQuery = (updates: Partial<Record<string, string>>) => {
    const params = new URLSearchParams();

    const next = {
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: String(query.page),
      ...updates,
    };

    if (next.search.trim()) {
      params.set("search", next.search.trim());
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

  if (students.length === 0 && query.page === 1) {
    return (
      <EmptyState
        title="No students yet"
        description="Convert a contact into a student by creating the first student profile."
        actionLabel="Create Student"
        actionHref="/students/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        onSubmit={(event) => {
          event.preventDefault();
          pushQuery({ search: searchInput, page: "1" });
        }}
        searchSlot={
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search student or linked contact"
          />
        }
        filtersSlot={
          <Select
            value={sortValue}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "name-asc") {
                pushQuery({ sortBy: "firstName", sortOrder: "asc", page: "1" });
                return;
              }

              if (value === "name-desc") {
                pushQuery({ sortBy: "firstName", sortOrder: "desc", page: "1" });
                return;
              }

              if (value === "created-asc") {
                pushQuery({ sortBy: "createdAt", sortOrder: "asc", page: "1" });
                return;
              }

              pushQuery({ sortBy: "createdAt", sortOrder: "desc", page: "1" });
            }}
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </Select>
        }
      />

      {students.length === 0 ? (
        <EmptyState
          title="No matching students"
          description="Try a different search or sort option."
        />
      ) : (
        <DataTableWrapper
          title="Student List"
          description="Students currently in the admissions pipeline."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Linked Contact</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.firstName} {student.lastName ?? ""}
                  </TableCell>
                  <TableCell>{student.email ?? "-"}</TableCell>
                  <TableCell>{student.phone ?? "-"}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{formatDate(student.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex flex-wrap items-center justify-end gap-2">
                      <Link href={`/students/${student.id}`} className="inline-flex">
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </Link>
                      <Link href={`/students/${student.id}/edit`} className="inline-flex">
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      </Link>
                      <DeleteEntityButton
                        resourceLabel="Student"
                        endpoint={`/students/${student.id}`}
                        size="sm"
                        onDeleted={() => {
                          setStudents((prev) => prev.filter((item) => item.id !== student.id));
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
