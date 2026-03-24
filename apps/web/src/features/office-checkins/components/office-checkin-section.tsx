import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { officeGlassPanel } from '@/features/office-checkins/components/office-checkin-glass';
import { cn } from '@/lib/utils';
import {
  getOfficeCheckinSectionMeta,
  type OfficeCheckinSectionKey,
} from '@/features/office-checkins/components/office-checkin-status-badge';
import type { ReactNode } from 'react';

type OfficeCheckinSectionProps = {
  sectionKey: OfficeCheckinSectionKey;
  count: number;
  isRefreshing: boolean;
  children: ReactNode;
};

export function OfficeCheckinSection({
  sectionKey,
  count,
  isRefreshing,
  children,
}: OfficeCheckinSectionProps) {
  const meta = getOfficeCheckinSectionMeta(sectionKey);

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-xl',
        officeGlassPanel(meta.muted),
        meta.sectionClassName,
      )}
    >
      <CardHeader className="relative border-b border-slate-700/65 px-4 py-3 md:px-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-400/8 to-transparent" />
        <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <span className={cn('mt-1 h-2 w-2 rounded-full', meta.accentClassName)} />
            <div className="space-y-0.5">
              <CardTitle className={cn('text-sm', meta.muted ? 'text-slate-700' : 'text-slate-900')}>
                {meta.title}
              </CardTitle>
              <p className="text-xs leading-5 text-slate-400">{meta.description}</p>
            </div>
          </div>

          <div
            className={cn(
              'flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1',
              meta.countClassName,
            )}
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">Count</span>
            <span className="text-xs font-semibold">{count}</span>
            {isRefreshing ? <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" /> : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-3 md:px-4 md:pb-4">
        <div className="space-y-2.5">{children}</div>
      </CardContent>
    </Card>
  );
}