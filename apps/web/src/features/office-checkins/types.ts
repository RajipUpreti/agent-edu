export const OFFICE_CHECKIN_STATUSES = [
  'UNASSIGNED',
  'WAITING',
  'ATTENDING',
  'COMPLETED',
  'CANCELLED',
] as const;

export type OfficeCheckinStatus = (typeof OFFICE_CHECKIN_STATUSES)[number];

export type OfficeCheckin = {
  id: string;
  branchId: string;
  contactId: string | null;
  hostId: string | null;
  createdById: string | null;
  visitorName: string;
  visitorEmail: string | null;
  visitorPhone: string | null;
  visitPurpose: string | null;
  notes: string | null;
  status: OfficeCheckinStatus;
  checkedInAt: string;
  attendedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  branch: {
    id: string;
    name: string;
  };
  host: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
  } | null;
  contact: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

export type OfficeCheckinOptions = {
  branches: Array<{
    id: string;
    name: string;
  }>;
  hosts: Array<{
    id: string;
    firstName: string;
    lastName: string | null;
    branchId: string | null;
  }>;
};

export type OfficeCheckinVisitorLookupResult = {
  contactId: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  studentId: string | null;
  label: string;
};

export type OfficeCheckinGroupedBuckets = {
  unassigned: OfficeCheckin[];
  waiting: OfficeCheckin[];
  attending: OfficeCheckin[];
  completed: OfficeCheckin[];
  cancelled: OfficeCheckin[];
};

export type OfficeCheckinDashboardQuery = {
  branchId: string;
  date: string;
  search: string;
  showCompleted: boolean;
};

export type GetOfficeCheckinsParams = {
  branchId?: string;
  date?: string;
  search?: string;
  showCompleted?: boolean;
  page?: number;
  limit?: number;
};
