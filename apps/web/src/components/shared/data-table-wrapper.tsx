import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DataTableWrapperProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function DataTableWrapper({
  title = "Records",
  description,
  children,
}: DataTableWrapperProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm text-gray-600">{description}</p> : null}
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-0">
        <div className="overflow-x-auto">{children}</div>
      </CardContent>
    </Card>
  );
}
