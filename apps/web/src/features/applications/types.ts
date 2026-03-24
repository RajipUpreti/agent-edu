export const APPLICATION_STATUSES = [
  "DRAFT",
  "IN_PROGRESS",
  "SUBMITTED",
  "OFFER_RECEIVED",
  "OFFER_ACCEPTED",
  "OFFER_REJECTED",
  "TUITION_PENDING",
  "COE_PENDING",
  "COE_RECEIVED",
  "VISA_IN_PROGRESS",
  "VISA_GRANTED",
  "VISA_REJECTED",
  "ENROLLED",
  "CANCELLED",
  "CLOSED",
] as const;

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type Application = {
  id: string;
  studentId: string;
  institutionId: string;
  courseId: string | null;
  intakeId: string | null;
  applicationNumber: string | null;
  status: ApplicationStatus;
  priority: Priority;
  appliedAt: string | null;
  submittedAt: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
  };
  institution?: {
    id: string;
    name: string;
    country: string;
  };
};

export type CreateApplicationInput = {
  studentId: string;
  institutionId: string;
  courseId?: string;
  intakeId?: string;
  applicationNumber?: string;
  status?: ApplicationStatus;
  priority?: Priority;
  appliedAt?: string;
  submittedAt?: string;
  remarks?: string;
};

export type UpdateApplicationInput = Partial<CreateApplicationInput>;
