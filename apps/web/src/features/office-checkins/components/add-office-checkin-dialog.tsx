"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  OfficeCheckinAddForm,
  type OfficeCheckinAddFormValues,
} from '@/features/office-checkins/components/office-checkin-add-form';
import type {
  OfficeCheckin,
  OfficeCheckinOptions,
  OfficeCheckinVisitorLookupResult,
} from '@/features/office-checkins/types';
import { useDebounce } from '@/features/office-checkins/use-debounce';
import { createOfficeCheckin, lookupOfficeCheckinVisitors } from '@/lib/api/office-checkins';

type AddOfficeCheckinDialogProps = {
  branchId: string;
  hosts: OfficeCheckinOptions['hosts'];
  disabled?: boolean;
  onCreated: (created: OfficeCheckin) => Promise<void> | void;
};

const initialFormValues: OfficeCheckinAddFormValues = {
  visitorName: '',
  visitorEmail: '',
  visitorPhone: '',
  visitPurpose: '',
  hostUserId: '',
};

export function AddOfficeCheckinDialog({
  branchId,
  hosts,
  disabled = false,
  onCreated,
}: AddOfficeCheckinDialogProps) {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<OfficeCheckinAddFormValues>(initialFormValues);
  const [selectedRecord, setSelectedRecord] = useState<OfficeCheckinVisitorLookupResult | null>(null);
  const [lookupResults, setLookupResults] = useState<OfficeCheckinVisitorLookupResult[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [showNoLookupMatch, setShowNoLookupMatch] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lookupName = useDebounce(formValues.visitorName, 300);
  const lookupEmail = useDebounce(formValues.visitorEmail, 300);
  const lookupPhone = useDebounce(formValues.visitorPhone, 300);
  const lookupSequence = useRef(0);

  const selectedBranchHosts = useMemo(
    () => hosts.filter((host) => (branchId ? host.branchId === branchId || host.branchId === null : true)),
    [branchId, hosts],
  );

  const resetForm = () => {
    setFormValues(initialFormValues);
    setSelectedRecord(null);
    setLookupResults([]);
    setLookupLoading(false);
    setShowNoLookupMatch(false);
    setFormError(null);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const mergedQuery = `${lookupName} ${lookupEmail} ${lookupPhone}`.trim();

    if (selectedRecord || !open) {
      setLookupLoading(false);
      setLookupResults([]);
      setShowNoLookupMatch(false);
      return;
    }

    if (mergedQuery.length < 2) {
      setLookupLoading(false);
      setLookupResults([]);
      setShowNoLookupMatch(false);
      return;
    }

    const currentRequest = lookupSequence.current + 1;
    lookupSequence.current = currentRequest;
    setLookupLoading(true);

    lookupOfficeCheckinVisitors({ q: mergedQuery, limit: 6 })
      .then((results) => {
        if (lookupSequence.current !== currentRequest) {
          return;
        }

        setLookupResults(results);
        setShowNoLookupMatch(results.length === 0);
      })
      .catch(() => {
        if (lookupSequence.current !== currentRequest) {
          return;
        }

        setLookupResults([]);
        setShowNoLookupMatch(false);
      })
      .finally(() => {
        if (lookupSequence.current === currentRequest) {
          setLookupLoading(false);
        }
      });
  }, [lookupEmail, lookupName, lookupPhone, open, selectedRecord]);

  const handleSubmit = async () => {
    if (!branchId) {
      setFormError('Select a branch first to create check-ins.');
      return;
    }

    if (!formValues.visitorName.trim()) {
      setFormError('Visitor name is required.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const created = await createOfficeCheckin({
        branchId,
        contactId: selectedRecord?.contactId,
        visitorName: formValues.visitorName.trim(),
        visitorEmail: formValues.visitorEmail.trim() || undefined,
        visitorPhone: formValues.visitorPhone.trim() || undefined,
        visitPurpose: formValues.visitPurpose.trim() || undefined,
        hostId: formValues.hostUserId || undefined,
      });

      await onCreated(created);
      setOpen(false);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create check-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={disabled}
        variant="primary"
        className="h-10 rounded-lg px-4"
      >
        Add Check-In
      </Button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl p-0">
          <Card className="w-full max-w-[48rem] mx-auto overflow-hidden">
            <CardHeader>
              <p className="meta-label text-slate-600">Walk-In Intake</p>
              <CardTitle className="text-slate-900">Add Check-In</CardTitle>
              <p className="text-sm text-slate-500">
                Register a visitor quickly, link an existing contact when matched, and assign a host now or later.
              </p>
            </CardHeader>
            <CardContent className="!p-5">
              <OfficeCheckinAddForm
                branchId={branchId}
                hosts={selectedBranchHosts}
                values={formValues}
                selectedRecord={selectedRecord}
                lookupResults={lookupResults}
                lookupLoading={lookupLoading}
                showNoLookupMatch={showNoLookupMatch}
                error={formError}
                isSubmitting={isSubmitting}
                onChange={(nextValues) => {
                  const identityChanged =
                    nextValues.visitorName !== formValues.visitorName ||
                    nextValues.visitorEmail !== formValues.visitorEmail ||
                    nextValues.visitorPhone !== formValues.visitorPhone;

                  if (identityChanged && selectedRecord) {
                    setSelectedRecord(null);
                  }

                  if (identityChanged) {
                    setShowNoLookupMatch(false);
                  }

                  setFormValues(nextValues);
                }}
                onSelectLookupResult={(record) => {
                  setSelectedRecord(record);
                  setLookupResults([]);
                  setShowNoLookupMatch(false);
                  setFormValues((current) => ({
                    ...current,
                    visitorName: record.displayName,
                    visitorEmail: current.visitorEmail || record.email || '',
                    visitorPhone: current.visitorPhone || record.phone || '',
                  }));
                }}
                onClearSelectedRecord={() => {
                  setSelectedRecord(null);
                  setShowNoLookupMatch(false);
                }}
                onCancel={() => setOpen(false)}
                onSubmit={() => {
                  void handleSubmit();
                }}
              />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
