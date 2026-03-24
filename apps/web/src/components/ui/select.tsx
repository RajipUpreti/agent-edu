import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400",
        className,
      )}
      {...props}
    />
  );
}
