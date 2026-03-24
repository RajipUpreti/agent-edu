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
import { CONTACT_STATUSES, type Contact } from "@/features/contacts/types";

type ContactsListProps = {
  contacts: Contact[];
  query: {
    search: string;
    status: string;
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

export function ContactsList({ contacts: initialContacts, query }: ContactsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchInput, setSearchInput] = useState<string>(query.search);

  const hasNextPage = contacts.length >= query.limit;

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
      status: query.status,
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

  if (contacts.length === 0 && query.page === 1) {
    return (
      <EmptyState
        title="No contacts yet"
        description="Start by adding your first lead so your counselors can begin follow-up."
        actionLabel="Create Contact"
        actionHref="/contacts/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        onSubmit={(event) => {
          event.preventDefault();
          pushQuery({ search: searchInput, page: "1" });
        }}
        searchSlot={
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search name, email, or phone"
          />
        }
        filtersSlot={
          <>
            <Select
              value={query.status}
              onChange={(event) => pushQuery({ status: event.target.value, page: "1" })}
            >
              <option value="ALL">All Statuses</option>
              {CONTACT_STATUSES.map((contactStatus) => (
                <option key={contactStatus} value={contactStatus}>
                  {contactStatus}
                </option>
              ))}
            </Select>

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
          </>
        }
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="No matching contacts"
          description="Try a different search, status filter, or sort option."
        />
      ) : (
        <DataTableWrapper title="Contact List" description="Latest leads from your intake channels.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName ?? ""}
                  </TableCell>
                  <TableCell>{contact.email ?? "-"}</TableCell>
                  <TableCell>{contact.phone ?? "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={contact.status} />
                  </TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex flex-wrap items-center justify-end gap-2">
                      <Link href={`/contacts/${contact.id}`} className="inline-flex">
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </Link>
                      <Link href={`/contacts/${contact.id}/edit`} className="inline-flex">
                        <Button size="sm" variant="ghost">
                          Edit
                        </Button>
                      </Link>
                      <DeleteEntityButton
                        resourceLabel="Contact"
                        endpoint={`/contacts/${contact.id}`}
                        size="sm"
                        onDeleted={() => {
                          setContacts((prev) => prev.filter((item) => item.id !== contact.id));
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
