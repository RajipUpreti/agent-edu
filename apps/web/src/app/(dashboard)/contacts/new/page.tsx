import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/features/contacts/components/contact-form";

export default function NewContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Contact"
        description="Add a new lead to start your Contact to Student conversion workflow."
      />
      <ContactForm mode="create" />
    </div>
  );
}
