import { cn } from "@/lib/utils";

// Glass utilities deprecated - use Tailwind classes directly
export const glass = {
  page: "",
  panel: "",
  card: "",
  mutedCard: "",
  toolbar: "",
  sidebar: "",
  header: "",
  input: "",
  dialog: "",
  badge: "",
  tableRow: "",
};

export function glassPanel(className?: string) {
  return cn(className);
}

export function glassCard(className?: string) {
  return cn(className);
}
