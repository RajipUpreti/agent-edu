import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  icon = "○",
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="flex min-h-52 flex-col items-center justify-center text-center">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl text-gray-400">
          {icon}
        </span>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        {actionLabel && actionHref ? (
          <Link href={actionHref} className="mt-4 inline-flex">
            <Button variant="primary" className="w-fit">{actionLabel}</Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
