import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterBar } from '@/components/shared/filter-bar';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { officeGlass } from '@/features/office-checkins/components/office-checkin-glass';
import { cn } from '@/lib/utils';
import type { OfficeCheckinDashboardQuery, OfficeCheckinOptions } from '@/features/office-checkins/types';

type OfficeCheckinToolbarProps = {
  options: OfficeCheckinOptions;
  query: OfficeCheckinDashboardQuery;
  totals: {
    total: number;
    active: number;
    completed: number;
  };
  isRefreshing: boolean;
  searchSettled: boolean;
  onBranchChange: (branchId: string) => void;
  onDateChange: (date: string) => void;
  onSearchChange: (search: string) => void;
  onShowCompletedChange: (showCompleted: boolean) => void;
};

export function OfficeCheckinToolbar({
  options,
  query,
  totals,
  isRefreshing,
  searchSettled,
  onBranchChange,
  onDateChange,
  onSearchChange,
  onShowCompletedChange,
}: OfficeCheckinToolbarProps) {
  const isSearchWorking = !searchSettled;

  return (
    <Card className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 px-4 py-4 md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-0.5">
            <p className="meta-label text-slate-700">Reception Controls</p>
            <CardTitle className="text-xl font-bold text-slate-900">Queue Controls</CardTitle>
            <p className="text-sm leading-6 text-slate-600">
              Filter by branch, date, and live search without leaving the dashboard.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">Total</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{totals.total}</p>
              </div>
              <div className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Active</p>
                <p className="mt-0.5 text-sm font-bold text-amber-900">{totals.active}</p>
              </div>
              <div className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">Closed</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{totals.completed}</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-5 pt-4 md:px-6">
        <FilterBar
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:grid-cols-[minmax(0,1.2fr)_minmax(0,2.2fr)_auto]"
          searchSlot={
            <div className="space-y-1">
              <label className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Live Search</label>
              <div className="relative">
                <Input
                  value={query.search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search visitor name, email, or visit purpose"
                  className={cn(
                    'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400',
                  )}
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2 text-xs text-slate-700">
                  {isSearchWorking || isRefreshing ? (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      <span className="font-semibold">Searching</span>
                    </>
                  ) : (
                    <span className="rounded border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold text-slate-700">
                      Live
                    </span>
                  )}
                </div>
              </div>
            </div>
          }
          filtersSlot={
            <>
              <div className="space-y-1">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Branch</label>
                <Select
                  value={query.branchId}
                  onChange={(event) => onBranchChange(event.target.value)}
                  className={cn('h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:border-blue-400', )}
                >
                  {options.branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">Date</label>
                <Input
                  type="date"
                  value={query.date}
                  onChange={(event) => onDateChange(event.target.value)}
                  className={cn('h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:border-blue-400')}
                />
              </div>
            </>
          }
          togglesSlot={
            <label
              className={cn(
                'glass-control flex h-10 w-full items-center justify-between rounded-lg border px-3 xl:min-w-[12rem] backdrop-blur-sm',
                query.showCompleted
                  ? 'border-slate-500/70 bg-slate-900/62 shadow-[inset_0_1px_0_rgba(181,198,232,0.2)]'
                  : 'border-slate-600/65 bg-slate-900/45 shadow-[inset_0_1px_0_rgba(181,198,232,0.16)]',
              )}
            >
              <span className="text-sm font-medium text-slate-200">Show completed</span>
              <Checkbox
                checked={query.showCompleted}
                onChange={(event) => onShowCompletedChange(event.target.checked)}
              />
            </label>
          }
        />
      </CardContent>
    </Card>
  );
}