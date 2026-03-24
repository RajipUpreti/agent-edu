import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function ApplicationNotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Not Found"
        description="The requested application does not exist."
      />
      <ErrorState
        title="Application missing"
        description="This application may have been deleted or the URL may be incorrect."
      />
      <Link href="/applications" className="inline-flex">
        <Button variant="outline">Back to Applications</Button>
      </Link>
    </div>
  );
}
