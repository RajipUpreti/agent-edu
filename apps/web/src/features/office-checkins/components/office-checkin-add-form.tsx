import { Button } from '@/components/ui/button';
import { officeGlass } from '@/features/office-checkins/components/office-checkin-glass';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import type {
  OfficeCheckinOptions,
  OfficeCheckinVisitorLookupResult,
} from '@/features/office-checkins/types';

export type OfficeCheckinAddFormValues = {
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitPurpose: string;
  hostUserId: string;
};

type OfficeCheckinAddFormProps = {
  branchId: string;
  hosts: OfficeCheckinOptions['hosts'];
  values: OfficeCheckinAddFormValues;
  selectedRecord: OfficeCheckinVisitorLookupResult | null;
  lookupResults: OfficeCheckinVisitorLookupResult[];
  lookupLoading: boolean;
  showNoLookupMatch: boolean;
  error: string | null;
  isSubmitting: boolean;
  onChange: (values: OfficeCheckinAddFormValues) => void;
  onSelectLookupResult: (record: OfficeCheckinVisitorLookupResult) => void;
  onClearSelectedRecord: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function OfficeCheckinAddForm({
  branchId,
  hosts,
  values,
  selectedRecord,
  lookupResults,
  lookupLoading,
  showNoLookupMatch,
  error,
  isSubmitting,
  onChange,
  onSelectLookupResult,
  onClearSelectedRecord,
  onCancel,
  onSubmit,
}: OfficeCheckinAddFormProps) {
  const isBranchSelected = Boolean(branchId);
  const visitPurposeRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (visitPurposeRef.current) {
      visitPurposeRef.current.style.height = 'auto';
      visitPurposeRef.current.style.height = `${visitPurposeRef.current.scrollHeight}px`;
    }
  }, [values.visitPurpose]);

  const handleVisitPurposeChange = (value: string) => {
    onChange({ ...values, visitPurpose: value });

    if (visitPurposeRef.current) {
      visitPurposeRef.current.style.height = 'auto';
      visitPurposeRef.current.style.height = `${visitPurposeRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2" style={{ alignItems: 'baseline' }}>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Visitor name</label>
          <Input
            value={values.visitorName}
            onChange={(event) => onChange({ ...values, visitorName: event.target.value })}
            placeholder="Enter visitor full name"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Visitor email</label>
          <Input
            value={values.visitorEmail}
            onChange={(event) => onChange({ ...values, visitorEmail: event.target.value })}
            placeholder="visitor@example.com"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Visitor phone</label>
          <Input
            value={values.visitorPhone}
            onChange={(event) => onChange({ ...values, visitorPhone: event.target.value })}
            placeholder="Visitor phone"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Visit purpose</label>
          <textarea
            ref={visitPurposeRef}
            value={values.visitPurpose}
            onChange={(event) => handleVisitPurposeChange(event.target.value)}
            placeholder="Application follow-up"
            className="min-h-[2.75rem] w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:outline-none"
            rows={2}
            style={{ resize: 'vertical', overflow: 'hidden', minHeight: '2.75rem', maxHeight: '12rem' }}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Host (optional)</label>
          <Select
            value={values.hostUserId}
            onChange={(event) => onChange({ ...values, hostUserId: event.target.value })}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus-visible:border-blue-400"
          >
            <option value="">Assign later</option>
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.firstName} {host.lastName ?? ''}
              </option>
            ))}
          </Select>
        </div>

        <div className="sm:col-span-2">
          {selectedRecord ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
              <span className="rounded-md border border-slate-400 bg-slate-800 px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-white">
                EXISTING CONTACT
              </span>
              <span className="font-semibold text-slate-800">{selectedRecord.displayName}</span>
              {selectedRecord.email ? <span className="text-slate-700">{selectedRecord.email}</span> : null}
              {selectedRecord.phone ? <span className="text-slate-700">{selectedRecord.phone}</span> : null}
              <button
                type="button"
                className="ml-auto rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                onClick={onClearSelectedRecord}
              >
                Use manual entry instead
              </button>
            </div>
          ) : null}

          {!selectedRecord && (lookupLoading || lookupResults.length > 0 || showNoLookupMatch) ? (
            <div className="mt-2 rounded-lg border border-slate-200 bg-white">
              {lookupLoading ? (
                <p className="px-3 py-2 text-sm text-slate-500">Searching existing visitors...</p>
              ) : lookupResults.length > 0 ? (
                <ul className="max-h-56 overflow-y-auto py-1">
                  {lookupResults.map((record) => (
                    <li key={record.contactId}>
                      <button
                        type="button"
                        className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left hover:bg-slate-800/60"
                        onClick={() => onSelectLookupResult(record)}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-100">{record.displayName}</p>
                          <p className="truncate text-xs text-slate-400">
                            {record.email ?? 'No email'} • {record.phone ?? 'No phone'}
                          </p>
                        </div>
                        <span className="rounded-full border border-slate-600/70 bg-slate-900/75 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                          {record.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : showNoLookupMatch ? (
                <p className="px-3 py-2 text-sm text-slate-400">No matching visitor found. Continue with manual entry.</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {!isBranchSelected ? (
        <p className="rounded-xl border border-amber-300/45 bg-amber-500/12 px-3 py-2 text-sm text-amber-200">
          Select a branch in Queue Controls before creating a check-in.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-300/45 bg-rose-500/14 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-700/65 pt-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          className="h-11 rounded-xl px-5"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !isBranchSelected}
          className="h-11 rounded-xl px-5"
        >
          {isSubmitting ? 'Adding...' : 'Add Check-In'}
        </Button>
      </div>
    </div>
  );
}