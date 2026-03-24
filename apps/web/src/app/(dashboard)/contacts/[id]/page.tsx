import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEntityButton } from "@/components/shared/delete-entity-button";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactById } from "@/lib/api/contacts";
import { ApiError } from "@/lib/api/http";

type ContactDetailPageProps = {
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

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const { id } = await params;

  try {
    const contact = await getContactById(id);

    return (
      <div className="space-y-6">
        <PageHeader
          title={`${contact.firstName} ${contact.lastName ?? ""}`.trim()}
          description="Contact profile and intake details"
          actions={
            <div className="flex items-center gap-2">
              <Link href={`/contacts/${contact.id}/edit`} className="inline-flex">
                <Button>Edit Contact</Button>
              </Link>
              <DeleteEntityButton
                resourceLabel="Contact"
                endpoint={`/contacts/${contact.id}`}
                redirectHref="/contacts"
              />
            </div>
          }
        />

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Status: </span>
                <StatusBadge status={contact.status} />
              </p>
              <p>
                <span className="font-medium">Lead Source: </span>
                {contact.leadSource ?? "-"}
              </p>
              <p>
                <span className="font-medium">Created At: </span>
                {formatDate(contact.createdAt)}
              </p>
              <p>
                <span className="font-medium">Updated At: </span>
                {formatDate(contact.updatedAt)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email: </span>
                {contact.email ?? "-"}
              </p>
              <p>
                <span className="font-medium">Phone: </span>
                {contact.phone ?? "-"}
              </p>
              <p>
                <span className="font-medium">Nationality: </span>
                {contact.nationality ?? "-"}
              </p>
              <p>
                <span className="font-medium">Preferred Destination: </span>
                {contact.preferredDestination ?? "-"}
              </p>
              <p>
                <span className="font-medium">Interested Service: </span>
                {contact.interestedService ?? "-"}
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            {contact.remarks?.trim() ? contact.remarks : "No remarks added yet."}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <PageHeader title="Contact" description="Lead profile" />
        <ErrorState
          description={
            error instanceof Error
              ? error.message
              : "Could not load this contact from the backend API."
          }
          actionLabel="Back to Contacts"
          actionHref="/contacts"
        />
      </div>
    );
  }
}
