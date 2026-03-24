import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function ContactNotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Contact Not Found" description="The requested contact does not exist." />
      <ErrorState
        title="Contact missing"
        description="This contact may have been deleted or the URL may be incorrect."
      />
      <Link href="/contacts" className="inline-flex">
        <Button variant="outline">Back to Contacts</Button>
      </Link>
    </div>
  );
}
