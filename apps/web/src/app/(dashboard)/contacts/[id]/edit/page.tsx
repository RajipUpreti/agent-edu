import { notFound } from "next/navigation";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/features/contacts/components/contact-form";
import { getContactById } from "@/lib/api/contacts";
import { ApiError } from "@/lib/api/http";

type EditContactPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id } = await params;

  const result = await getContactById(id)
    .then((contact) => ({ contact, error: null }))
    .catch((error: unknown) => ({ contact: null, error }));

  if (result.error) {
    if (result.error instanceof ApiError && result.error.status === 404) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <PageHeader title="Edit Contact" description="Update lead details." />
        <ErrorState
          description={
            result.error instanceof Error
              ? result.error.message
              : "Could not load this contact for editing."
          }
          actionLabel="Back to Contacts"
          actionHref="/contacts"
        />
      </div>
    );
  }

  const contact = result.contact;

  if (!contact) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Contact"
        description="Update lead details and progression status."
      />
      <ContactForm mode="edit" contactId={contact.id} initialValues={contact} />
    </div>
  );
}
