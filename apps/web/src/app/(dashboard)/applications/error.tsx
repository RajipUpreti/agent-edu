"use client";

import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

type ApplicationsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ApplicationsError({ error, reset }: ApplicationsErrorProps) {
  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Manage student applications." />
      <ErrorState description={error.message} />
      <Button onClick={reset} variant="outline">
        Retry
      </Button>
    </div>
  );
}
