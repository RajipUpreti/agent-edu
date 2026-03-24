export const STUDENT_GENDERS = [
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

export type StudentGender = (typeof STUDENT_GENDERS)[number];

export type Student = {
  id: string;
  contactId: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  gender: StudentGender | null;
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
  passportExpiry: string | null;
  highestQualification: string | null;
  graduationYear: number | null;
  currentOccupation: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  applicationCount?: number;
  eventCount?: number;
  taskCount?: number;
  notesCount?: number;
  contact?: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    status: string;
  } | null;
};

export type CreateStudentInput = {
  contactId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: StudentGender;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  highestQualification?: string;
  graduationYear?: number;
  currentOccupation?: string;
  remarks?: string;
};

export type UpdateStudentInput = Partial<CreateStudentInput>;
