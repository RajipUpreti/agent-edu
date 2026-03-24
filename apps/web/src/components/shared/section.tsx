import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionProps = {
  title: string;
  count?: number;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ title, count, description, children, className }: SectionProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {typeof count === "number" ? (
          <span className="glass-badge inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold text-muted-foreground">
            {count}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
