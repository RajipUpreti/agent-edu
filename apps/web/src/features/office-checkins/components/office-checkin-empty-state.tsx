import { cn } from '@/lib/utils';
import { officeGlass } from '@/features/office-checkins/components/office-checkin-glass';

type OfficeCheckinEmptyStateProps = {
  title: string;
  description: string;
  hint?: string;
  muted?: boolean;
  centered?: boolean;
};

export function OfficeCheckinEmptyState({
  title,
  description,
  hint,
  muted = false,
  centered = false,
}: OfficeCheckinEmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border border-dashed px-5 text-center',
        centered ? 'min-h-44 py-8' : 'min-h-28 py-6',
        muted
          ? 'glass-muted text-slate-400'
          : cn('border-slate-600/65 text-slate-300', officeGlass.surface),
      )}
    >
      {!muted ? (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-300/10 via-transparent to-sky-400/8" />
      ) : null}
      <div
        className={cn(
          'relative mb-3 h-8 w-8 rounded-full border',
          muted ? 'border-slate-600 bg-slate-800/80' : 'border-slate-500 bg-slate-800/85',
        )}
      />
      <p className="relative text-sm font-semibold text-slate-100">{title}</p>
      <p className="relative mt-1.5 max-w-md text-sm leading-5 text-slate-400">{description}</p>
      {hint ? <p className="relative mt-2 font-mono text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}