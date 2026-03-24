"use client";

import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

type ContactsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ContactsError({ error, reset }: ContactsErrorProps) {
  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" description="Manage incoming leads." />
      <ErrorState description={error.message} />
      <Button onClick={reset} variant="outline">
        Retry
      </Button>
    </div>
  );
}
