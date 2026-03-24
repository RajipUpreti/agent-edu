import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ContactsList } from "@/features/contacts/components/contacts-list";
import { getContacts } from "@/lib/api/contacts";

type ContactsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const params = await searchParams;
  const search = readParam(params.search) ?? "";
  const status = readParam(params.status) ?? "ALL";
  const sortBy = readParam(params.sortBy) ?? "createdAt";
  const sortOrder = readParam(params.sortOrder) ?? "desc";
  const page = Math.max(1, Number(readParam(params.page) ?? "1") || 1);
  const limit = 20;

  const result = await getContacts({
    search,
    status: status === "ALL" ? undefined : status,
    sortBy: sortBy === "firstName" ? "firstName" : "createdAt",
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
    page,
    limit,
  })
    .then((contacts) => ({ contacts, error: null }))
    .catch((error: unknown) => ({ contacts: null, error }));

  if (result.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Contacts" description="Manage incoming leads." />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load contacts from the backend API."
          }
          actionLabel="Try Again"
          actionHref="/contacts"
        />
      </div>
    );
  }

  const contacts = result.contacts ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage incoming leads and prepare them for conversion into students."
        actions={
          <Link href="/contacts/new" className="inline-flex">
            <Button>New Contact</Button>
          </Link>
        }
      />
      <ContactsList
        contacts={contacts}
        query={{ search, status, sortBy, sortOrder, page, limit }}
      />
    </div>
  );
}
