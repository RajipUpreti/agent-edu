"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormSection } from "@/components/shared/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getContacts } from "@/lib/api/contacts";
import { createStudent, updateStudent } from "@/lib/api/students";
import {
  STUDENT_GENDERS,
  type CreateStudentInput,
  type Student,
  type UpdateStudentInput,
} from "@/features/students/types";

type StudentFormMode = "create" | "edit";

type StudentFormProps = {
  mode: StudentFormMode;
  studentId?: string;
  initialValues?: Student;
};

type StudentFormValues = {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  highestQualification: string;
  graduationYear: string;
  currentOccupation: string;
  remarks: string;
};

function toDateInput(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.split("T")[0] ?? "";
}

function toFormValues(student?: Student): StudentFormValues {
  return {
    contactId: student?.contactId ?? "",
    firstName: student?.firstName ?? "",
    lastName: student?.lastName ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    gender: student?.gender ?? "",
    dateOfBirth: toDateInput(student?.dateOfBirth),
    nationality: student?.nationality ?? "",
    passportNumber: student?.passportNumber ?? "",
    passportExpiry: toDateInput(student?.passportExpiry),
    highestQualification: student?.highestQualification ?? "",
    graduationYear: student?.graduationYear ? String(student.graduationYear) : "",
    currentOccupation: student?.currentOccupation ?? "",
    remarks: student?.remarks ?? "",
  };
}

function toPayload(values: StudentFormValues): CreateStudentInput | UpdateStudentInput {
  const graduationYear = Number(values.graduationYear);

  return {
    contactId: values.contactId,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim() || undefined,
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    gender: values.gender ? (values.gender as CreateStudentInput["gender"]) : undefined,
    dateOfBirth: values.dateOfBirth || undefined,
    nationality: values.nationality.trim() || undefined,
    passportNumber: values.passportNumber.trim() || undefined,
    passportExpiry: values.passportExpiry || undefined,
    highestQualification: values.highestQualification.trim() || undefined,
    graduationYear: Number.isNaN(graduationYear) ? undefined : graduationYear,
    currentOccupation: values.currentOccupation.trim() || undefined,
    remarks: values.remarks.trim() || undefined,
  };
}

export function StudentForm({ mode, studentId, initialValues }: StudentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<
    Array<{ id: string; firstName: string; lastName: string | null }>
  >([]);
  const [contactsLoading, setContactsLoading] = useState<boolean>(true);
  const [values, setValues] = useState<StudentFormValues>(() => toFormValues(initialValues));

  useEffect(() => {
    let active = true;

    getContacts()
      .then((response) => {
        if (!active) {
          return;
        }

        setContacts(
          response.map((contact) => ({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
          })),
        );
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setContacts([]);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setContactsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const submitLabel = useMemo(
    () => (mode === "create" ? "Create Student" : "Save Changes"),
    [mode],
  );

  const setField = (field: keyof StudentFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.contactId) {
      setError("Contact is required.");
      return;
    }

    if (!values.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = toPayload(values);

        if (mode === "create") {
          const created = await createStudent(payload as CreateStudentInput);
          router.push(`/students/${created.id}`);
          router.refresh();
          return;
        }

        if (!studentId) {
          setError("Student id is missing for edit mode.");
          return;
        }

        const updated = await updateStudent(studentId, payload as UpdateStudentInput);
        router.push(`/students/${updated.id}`);
        router.refresh();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Unable to save student.");
      }
    });
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <FormSection
        title="Student Profile"
        description="Create or update the student record linked to an existing contact."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactId">Linked Contact *</Label>
            <Select
              id="contactId"
              value={values.contactId}
              onChange={(event) => setField("contactId", event.target.value)}
              disabled={contactsLoading || isPending}
              required
            >
              <option value="">Select contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName ?? ""}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(event) => setField("firstName", event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(event) => setField("lastName", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={values.phone}
              onChange={(event) => setField("phone", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              value={values.gender}
              onChange={(event) => setField("gender", event.target.value)}
            >
              <option value="">Select gender</option>
              {STUDENT_GENDERS.map((gender) => (
                <option value={gender} key={gender}>
                  {gender}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={values.dateOfBirth}
              onChange={(event) => setField("dateOfBirth", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={values.nationality}
              onChange={(event) => setField("nationality", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentOccupation">Current Occupation</Label>
            <Input
              id="currentOccupation"
              value={values.currentOccupation}
              onChange={(event) => setField("currentOccupation", event.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Academic and Passport Information">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="highestQualification">Highest Qualification</Label>
            <Input
              id="highestQualification"
              value={values.highestQualification}
              onChange={(event) => setField("highestQualification", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              value={values.graduationYear}
              onChange={(event) => setField("graduationYear", event.target.value)}
              min={1900}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passportNumber">Passport Number</Label>
            <Input
              id="passportNumber"
              value={values.passportNumber}
              onChange={(event) => setField("passportNumber", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passportExpiry">Passport Expiry</Label>
            <Input
              id="passportExpiry"
              type="date"
              value={values.passportExpiry}
              onChange={(event) => setField("passportExpiry", event.target.value)}
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
