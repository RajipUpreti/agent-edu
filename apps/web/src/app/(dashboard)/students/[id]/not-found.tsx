import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function StudentNotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Student Not Found" description="The requested student does not exist." />
      <ErrorState
        title="Student missing"
        description="This student may have been deleted or the URL may be incorrect."
      />
      <Link href="/students" className="inline-flex">
        <Button variant="outline">Back to Students</Button>
      </Link>
    </div>
  );
}
