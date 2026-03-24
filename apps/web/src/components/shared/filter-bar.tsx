import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  searchSlot?: ReactNode;
  filtersSlot?: ReactNode;
  togglesSlot?: ReactNode;
  actionsSlot?: ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export function FilterBar({
  searchSlot,
  filtersSlot,
  togglesSlot,
  actionsSlot,
  className,
  onSubmit,
}: FilterBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_auto] md:items-end",
        className,
      )}
    >
      <div className="min-w-0">{searchSlot}</div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtersSlot}</div>
      <div className="flex min-h-10 flex-wrap items-center justify-start gap-2 md:justify-end">
        {togglesSlot}
        {actionsSlot}
      </div>
    </form>
  );
}
