"use client";

import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

type StudentsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function StudentsError({ error, reset }: StudentsErrorProps) {
  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage enrolled and prospective students." />
      <ErrorState description={error.message} />
      <Button onClick={reset} variant="outline">
        Retry
      </Button>
    </div>
  );
}
