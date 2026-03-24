"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormSection } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  APPLICATION_STATUSES,
  PRIORITIES,
  type Application,
  type CreateApplicationInput,
  type UpdateApplicationInput,
} from "@/features/applications/types";
import { createApplication, updateApplication } from "@/lib/api/applications";
import {
  searchInstitutions,
  type InstitutionLookup,
} from "@/lib/api/institutions";
import { getStudents } from "@/lib/api/students";

type ApplicationFormMode = "create" | "edit";

type ApplicationFormProps = {
  mode: ApplicationFormMode;
  applicationId?: string;
  initialValues?: Application;
};

type ApplicationFormValues = {
  studentId: string;
  institutionId: string;
  courseId: string;
  intakeId: string;
  applicationNumber: string;
  status: string;
  priority: string;
  appliedAt: string;
  submittedAt: string;
  remarks: string;
};

function toDateInput(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.split("T")[0] ?? "";
}

function toFormValues(application?: Application): ApplicationFormValues {
  return {
    studentId: application?.studentId ?? "",
    institutionId: application?.institutionId ?? "",
    courseId: application?.courseId ?? "",
    intakeId: application?.intakeId ?? "",
    applicationNumber: application?.applicationNumber ?? "",
    status: application?.status ?? "DRAFT",
    priority: application?.priority ?? "MEDIUM",
    appliedAt: toDateInput(application?.appliedAt),
    submittedAt: toDateInput(application?.submittedAt),
    remarks: application?.remarks ?? "",
  };
}

function toPayload(values: ApplicationFormValues): CreateApplicationInput | UpdateApplicationInput {
  return {
    studentId: values.studentId,
    institutionId: values.institutionId,
    courseId: values.courseId.trim() || undefined,
    intakeId: values.intakeId.trim() || undefined,
    applicationNumber: values.applicationNumber.trim() || undefined,
    status: values.status as CreateApplicationInput["status"],
    priority: values.priority as CreateApplicationInput["priority"],
    appliedAt: values.appliedAt || undefined,
    submittedAt: values.submittedAt || undefined,
    remarks: values.remarks.trim() || undefined,
  };
}

export function ApplicationForm({ mode, applicationId, initialValues }: ApplicationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<
    Array<{ id: string; firstName: string; lastName: string | null }>
  >([]);
  const [institutions, setInstitutions] = useState<InstitutionLookup[]>([]);
  const [institutionsLoading, setInstitutionsLoading] = useState<boolean>(false);
  const [institutionQuery, setInstitutionQuery] = useState<string>(
    initialValues?.institution?.name ?? "",
  );
  const [institutionMenuOpen, setInstitutionMenuOpen] = useState<boolean>(false);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(true);
  const [values, setValues] = useState<ApplicationFormValues>(() => toFormValues(initialValues));

  useEffect(() => {
    let active = true;

    getStudents()
      .then((response) => {
        if (!active) {
          return;
        }

        setStudents(
          response.map((student) => ({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
          })),
        );
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setStudents([]);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setStudentsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const timeout = setTimeout(() => {
      if (!active) {
        return;
      }

      setInstitutionsLoading(true);

      searchInstitutions(institutionQuery, 12)
        .then((response) => {
          if (!active) {
            return;
          }

          setInstitutions(response);
        })
        .catch(() => {
          if (!active) {
            return;
          }

          setInstitutions([]);
        })
        .finally(() => {
          if (!active) {
            return;
          }

          setInstitutionsLoading(false);
        });
    }, 200);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [institutionQuery]);

  const submitLabel = useMemo(
    () => (mode === "create" ? "Create Application" : "Save Changes"),
    [mode],
  );

  const setField = (field: keyof ApplicationFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.studentId) {
      setError("Student is required.");
      return;
    }

    if (!values.institutionId.trim()) {
      setError("Institution ID is required.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = toPayload(values);

        if (mode === "create") {
          const created = await createApplication(payload as CreateApplicationInput);
          router.push(`/applications/${created.id}`);
          router.refresh();
          return;
        }

        if (!applicationId) {
          setError("Application id is missing for edit mode.");
          return;
        }

        const updated = await updateApplication(applicationId, payload as UpdateApplicationInput);
        router.push(`/applications/${updated.id}`);
        router.refresh();
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : "Unable to save application.",
        );
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <FormSection
        title="Application Details"
        description="Capture primary application records for the student journey."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="studentId">Student *</Label>
            <Select
              id="studentId"
              value={values.studentId}
              onChange={(event) => setField("studentId", event.target.value)}
              disabled={studentsLoading || isPending}
              required
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName ?? ""}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutionLookup">Institution *</Label>
            <div className="relative">
              <Input
                id="institutionLookup"
                value={institutionQuery}
                onChange={(event) => {
                  setInstitutionQuery(event.target.value);
                  setInstitutionMenuOpen(true);
                  setField("institutionId", "");
                }}
                onFocus={() => setInstitutionMenuOpen(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setInstitutionMenuOpen(false);
                  }, 120);
                }}
                placeholder="Search institution name or country"
                required
              />

              <input type="hidden" value={values.institutionId} />

              {institutionMenuOpen ? (
                <div className="glass-panel absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl">
                  {institutionsLoading ? (
                    <p className="px-3 py-2 text-sm text-muted">Loading institutions...</p>
                  ) : institutions.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted">No institutions found.</p>
                  ) : (
                    institutions.map((institution) => (
                      <button
                        key={institution.id}
                        type="button"
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-white/90"
                        onMouseDown={() => {
                          setField("institutionId", institution.id);
                          setInstitutionQuery(`${institution.name} (${institution.country})`);
                          setInstitutionMenuOpen(false);
                        }}
                      >
                        <span className="font-medium text-foreground">{institution.name}</span>
                        <span className="ml-2 text-xs text-muted">{institution.country}</span>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>
            <p className="text-xs text-muted">
              {values.institutionId
                ? `Selected institution ID: ${values.institutionId}`
                : "Select an institution from the dropdown list."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationNumber">Application Number</Label>
            <Input
              id="applicationNumber"
              value={values.applicationNumber}
              onChange={(event) => setField("applicationNumber", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={values.status}
              onChange={(event) => setField("status", event.target.value)}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={values.priority}
              onChange={(event) => setField("priority", event.target.value)}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID</Label>
            <Input
              id="courseId"
              value={values.courseId}
              onChange={(event) => setField("courseId", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intakeId">Intake ID</Label>
            <Input
              id="intakeId"
              value={values.intakeId}
              onChange={(event) => setField("intakeId", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appliedAt">Applied At</Label>
            <Input
              id="appliedAt"
              type="date"
              value={values.appliedAt}
              onChange={(event) => setField("appliedAt", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submittedAt">Submitted At</Label>
            <Input
              id="submittedAt"
              type="date"
              value={values.submittedAt}
              onChange={(event) => setField("submittedAt", event.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={values.remarks}
            onChange={(event) => setField("remarks", event.target.value)}
          />
        </div>
      </FormSection>

      {error ? (
        <div className="rounded-xl border border-rose-300/60 bg-rose-50/82 p-3 text-sm text-rose-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
          {error}
        </div>
      ) : null}

      <div className="glass-toolbar flex items-center gap-3 rounded-2xl p-3 md:p-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
