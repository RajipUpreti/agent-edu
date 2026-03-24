import { cn } from '@/lib/utils';
import type { OfficeCheckinStatus } from '@/features/office-checkins/types';

export const officeCheckinSectionOrder = [
  'unassigned',
  'waiting',
  'attending',
  'completed',
  'cancelled',
] as const;

export type OfficeCheckinSectionKey = (typeof officeCheckinSectionOrder)[number];

const sectionKeyByStatus: Record<OfficeCheckinStatus, OfficeCheckinSectionKey> = {
  UNASSIGNED: 'unassigned',
  WAITING: 'waiting',
  ATTENDING: 'attending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const sectionMeta: Record<
  OfficeCheckinSectionKey,
  {
    title: string;
    description: string;
    badgeClassName: string;
    countClassName: string;
    sectionClassName: string;
    rowClassName: string;
    elapsedClassName: string;
    accentClassName: string;
    muted: boolean;
  }
> = {
  unassigned: {
    title: 'Unassigned',
    description: 'Visitors still waiting for a host assignment.',
    badgeClassName: 'border-blue-200 bg-blue-100 text-blue-700',
    countClassName: 'border-blue-200 bg-blue-100 text-blue-700',
    sectionClassName: 'border-blue-200 bg-blue-50',
    rowClassName: 'border-blue-200 bg-white',
    elapsedClassName: 'border-blue-200 bg-blue-50 text-blue-700',
    accentClassName: 'bg-blue-500',
    muted: false,
  },
  waiting: {
    title: 'Waiting',
    description: 'Visitors assigned and waiting to be called in.',
    badgeClassName: 'border-amber-300 bg-amber-100 text-amber-700',
    countClassName: 'border-amber-300 bg-amber-100 text-amber-700',
    sectionClassName: 'border-amber-200 bg-amber-50',
    rowClassName: 'border-amber-200 bg-white',
    elapsedClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    accentClassName: 'bg-amber-500',
    muted: false,
  },
  attending: {
    title: 'Attending',
    description: 'Visitors currently being served by a host.',
    badgeClassName: 'border-emerald-300 bg-emerald-100 text-emerald-700',
    countClassName: 'border-emerald-300 bg-emerald-100 text-emerald-700',
    sectionClassName: 'border-emerald-200 bg-emerald-50',
    rowClassName: 'border-emerald-200 bg-white',
    elapsedClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    accentClassName: 'bg-emerald-500',
    muted: false,
  },
  completed: {
    title: 'Completed',
    description: 'Finished visits kept visible for quick reference.',
    badgeClassName: 'border-slate-200 bg-slate-100 text-slate-600',
    countClassName: 'border-slate-200 bg-slate-100 text-slate-600',
    sectionClassName: 'border-slate-200 bg-slate-50',
    rowClassName: 'border-slate-200 bg-white',
    elapsedClassName: 'border-slate-200 bg-slate-100 text-slate-600',
    accentClassName: 'bg-slate-400',
    muted: true,
  },
  cancelled: {
    title: 'Cancelled',
    description: 'Cancelled visits kept muted to reduce visual noise.',
    badgeClassName: 'border-slate-200 bg-slate-100 text-slate-600',
    countClassName: 'border-slate-200 bg-slate-100 text-slate-600',
    sectionClassName: 'border-slate-200 bg-slate-50',
    rowClassName: 'border-slate-200 bg-white',
    elapsedClassName: 'border-slate-200 bg-slate-100 text-slate-600',
    accentClassName: 'bg-slate-400',
    muted: true,
  },
};

export function getOfficeCheckinSectionKey(status: OfficeCheckinStatus) {
  return sectionKeyByStatus[status];
}

export function getOfficeCheckinSectionMeta(sectionKey: OfficeCheckinSectionKey) {
  return sectionMeta[sectionKey];
}

type OfficeCheckinStatusBadgeProps = {
  status: OfficeCheckinStatus;
  className?: string;
};

export function OfficeCheckinStatusBadge({ status, className }: OfficeCheckinStatusBadgeProps) {
  const meta = getOfficeCheckinSectionMeta(getOfficeCheckinSectionKey(status));

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]',
        meta.badgeClassName,
        className,
      )}
    >
      {meta.title}
    </span>
  );
}