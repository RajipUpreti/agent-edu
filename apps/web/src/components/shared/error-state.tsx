import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorStateProps = {
  title?: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description,
  actionLabel,
  actionHref,
}: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-red-600">
        <p>{description}</p>
        {actionLabel && actionHref ? (
          <Link href={actionHref} className="inline-flex">
            <Button variant="secondary">{actionLabel}</Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
