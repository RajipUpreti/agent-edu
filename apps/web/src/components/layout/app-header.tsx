import { glass } from "@/lib/glass";

export function AppHeader() {
  return (
    <header className={`relative z-10 border-b px-5 py-2.5 ${glass.header}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="meta-label">Education CRM</p>
          <h2 className="text-sm font-medium text-foreground">Operations Workspace</h2>
        </div>
        <p className="meta-label hidden rounded border border-slate-700/70 bg-slate-950/45 px-2.5 py-1 md:block">
          Console Link Stable
        </p>
      </div>
    </header>
  );
}
