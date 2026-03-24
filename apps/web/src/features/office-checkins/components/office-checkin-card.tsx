import { Button } from '@/components/ui/button';
import { officeGlass } from '@/features/office-checkins/components/office-checkin-glass';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  getOfficeCheckinSectionKey,
  getOfficeCheckinSectionMeta,
  OfficeCheckinStatusBadge,
} from '@/features/office-checkins/components/office-checkin-status-badge';
import type { OfficeCheckin, OfficeCheckinOptions, OfficeCheckinStatus } from '@/features/office-checkins/types';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'V';
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 1).toUpperCase() ?? 'V';
  }

  return `${parts[0]?.slice(0, 1) ?? ''}${parts[1]?.slice(0, 1) ?? ''}`.toUpperCase();
}

function formatElapsed(checkedInAt: string) {
  const diff = Date.now() - new Date(checkedInAt).getTime();

  if (diff <= 0) {
    return '0m';
  }

  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

type OfficeCheckinCardProps = {
  item: OfficeCheckin;
  hosts: OfficeCheckinOptions['hosts'];
  busy: boolean;
  onAssignHost: (id: string, hostId: string | null) => void;
  onApplyStatus: (id: string, status: OfficeCheckinStatus) => void;
};

export function OfficeCheckinCard({
  item,
  hosts,
  busy,
  onAssignHost,
  onApplyStatus,
}: OfficeCheckinCardProps) {
  const contactDetail = item.visitorEmail ?? item.visitorPhone ?? 'No contact detail';
  const isClosed = item.status === 'COMPLETED' || item.status === 'CANCELLED';
  const sectionMeta = getOfficeCheckinSectionMeta(getOfficeCheckinSectionKey(item.status));

  return (
    <article
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition text-slate-900',
        busy && 'opacity-95',
      )}
    >
      <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-start xl:gap-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white shadow',
              isClosed ? 'bg-slate-600' : 'bg-blue-600',
            )}
          >
            {initials(item.visitorName)}
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={cn('text-sm font-semibold', isClosed ? 'text-slate-700' : 'text-slate-900')}>
                {item.visitorName}
              </p>
              <OfficeCheckinStatusBadge status={item.status} className="bg-blue-100 text-blue-700 border-blue-200" />
            </div>
            <p className="truncate text-sm text-slate-700">{contactDetail}</p>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-600">
              Checked in {formatElapsed(item.checkedInAt)} ago
            </p>
          </div>
        </div>

        <div className="space-y-1 xl:pt-0.5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Visit purpose</p>
          <p className={cn('text-sm leading-5', isClosed ? 'text-slate-500' : 'text-slate-700')}>
            {item.visitPurpose ?? 'General inquiry'}
          </p>
        </div>

        <div className="space-y-1 xl:pt-0.5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Host</p>
          <Select
            value={item.hostId ?? ''}
            onChange={(event) => onAssignHost(item.id, event.target.value || null)}
            disabled={busy}
            className="h-9 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="">Assign host</option>
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.firstName} {host.lastName ?? ''}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end xl:self-center">
          <span
            className={cn(
              'rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700',
              sectionMeta.elapsedClassName,
            )}
          >
            {formatElapsed(item.checkedInAt)}
          </span>

          {(item.status === 'UNASSIGNED' || item.status === 'WAITING') && (
            <Button
              size="sm"
              onClick={() => onApplyStatus(item.id, 'ATTENDING')}
              disabled={busy}
              className="h-8 rounded-lg px-3.5"
            >
              Attend
            </Button>
          )}

          {item.status === 'ATTENDING' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApplyStatus(item.id, 'COMPLETED')}
              disabled={busy}
              className="h-8 rounded-lg px-3.5"
            >
              Mark completed
            </Button>
          )}

          {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onApplyStatus(item.id, 'CANCELLED')}
              disabled={busy}
              className="h-8 rounded-lg px-3.5 text-slate-300 hover:bg-slate-800/55"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}