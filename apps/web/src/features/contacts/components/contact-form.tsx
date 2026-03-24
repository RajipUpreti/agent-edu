"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "@/components/shared/form-section";
import { createContact, updateContact } from "@/lib/api/contacts";
import {
  CONTACT_STATUSES,
  LEAD_SOURCES,
  type Contact,
  type CreateContactInput,
  type UpdateContactInput,
} from "@/features/contacts/types";

type ContactFormMode = "create" | "edit";

type ContactFormProps = {
  mode: ContactFormMode;
  contactId?: string;
  initialValues?: Contact;
};

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  preferredDestination: string;
  interestedService: string;
  remarks: string;
  status: string;
  leadSource: string;
};

function toFormValues(contact?: Contact): ContactFormValues {
  return {
    firstName: contact?.firstName ?? "",
    lastName: contact?.lastName ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    nationality: contact?.nationality ?? "",
    preferredDestination: contact?.preferredDestination ?? "",
    interestedService: contact?.interestedService ?? "",
    remarks: contact?.remarks ?? "",
    status: contact?.status ?? "NEW",
    leadSource: contact?.leadSource ?? "",
  };
}

function buildPayload(values: ContactFormValues): CreateContactInput | UpdateContactInput {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim() || undefined,
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    nationality: values.nationality.trim() || undefined,
    preferredDestination: values.preferredDestination.trim() || undefined,
    interestedService: values.interestedService.trim() || undefined,
    remarks: values.remarks.trim() || undefined,
    status: values.status ? (values.status as CreateContactInput["status"]) : undefined,
    leadSource: values.leadSource
      ? (values.leadSource as CreateContactInput["leadSource"])
      : undefined,
  };
}

export function ContactForm({ mode, contactId, initialValues }: ContactFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<ContactFormValues>(() => toFormValues(initialValues));

  const submitLabel = useMemo(
    () => (mode === "create" ? "Create Contact" : "Save Changes"),
    [mode],
  );

  const updateField = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = buildPayload(values);

        if (mode === "create") {
          const created = await createContact(payload as CreateContactInput);
          router.push(`/contacts/${created.id}`);
          router.refresh();
          return;
        }

        if (!contactId) {
          setError("Contact id is missing for edit mode.");
          return;
        }

        const updated = await updateContact(contactId, payload as UpdateContactInput);
        router.push(`/contacts/${updated.id}`);
        router.refresh();
      } catch (submitError) {
        const message =
          submitError instanceof Error ? submitError.message : "Unable to save contact.";
        setError(message);
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <FormSection
        title="Contact Information"
        description="Capture lead details that your counselors will use for follow-up and conversion."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              placeholder="Aarav"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              placeholder="Sharma"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="student@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+61 400 123 456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={values.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {CONTACT_STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadSource">Lead Source</Label>
            <Select
              id="leadSource"
              value={values.leadSource}
              onChange={(event) => updateField("leadSource", event.target.value)}
            >
              <option value="">Select source</option>
              {LEAD_SOURCES.map((source) => (
                <option value={source} key={source}>
                  {source}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={values.nationality}
              onChange={(event) => updateField("nationality", event.target.value)}
              placeholder="Nepal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDestination">Preferred Destination</Label>
            <Input
              id="preferredDestination"
              value={values.preferredDestination}
              onChange={(event) => updateField("preferredDestination", event.target.value)}
              placeholder="Australia"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="interestedService">Interested Service</Label>
            <Input
              id="interestedService"
              value={values.interestedService}
              onChange={(event) => updateField("interestedService", event.target.value)}
              placeholder="University Admissions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={values.remarks}
              onChange={(event) => updateField("remarks", event.target.value)}
              placeholder="Notes from initial counseling conversation"
            />
          </div>
        </div>
      </FormSection>

      {error ? (
        <div className="rounded-xl border border-rose-300/60 bg-rose-50/82 p-3 text-sm text-rose-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
          {error}
        </div>
      ) : null}

      <div className="glass-toolbar flex items-center gap-3 rounded-2xl p-3 md:p-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
