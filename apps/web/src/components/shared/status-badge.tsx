import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string | null | undefined;
  className?: string;
};

const toneMap: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  QUALIFIED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
  CONVERTED: "bg-emerald-100 text-emerald-700",
  DRAFT: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
};

function toLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status?.toUpperCase() ?? "UNKNOWN";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneMap[normalized] ?? "bg-gray-100 text-gray-700",
        className,
      )}
    >
      {toLabel(normalized)}
    </span>
  );
}
