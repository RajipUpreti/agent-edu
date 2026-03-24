import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        {description ? <p className="text-sm text-gray-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2 self-start md:self-auto">{actions}</div> : null}
    </header>
  );
}
