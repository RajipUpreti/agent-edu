import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";

export const officeGlass = {
  panel: "bg-white border border-slate-200 shadow-sm",
  panelMuted: "bg-slate-50",
  surface: "bg-white border border-slate-200",
  control: "border border-slate-300 bg-white text-slate-800",
  controlHover: "hover:border-blue-400",
};

export function officeGlassPanel(muted = false) {
  return cn(officeGlass.panel, muted && officeGlass.panelMuted);
}
