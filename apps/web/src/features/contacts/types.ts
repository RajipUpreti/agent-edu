export const CONTACT_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "LOST",
  "CONVERTED",
] as const;

export const LEAD_SOURCES = [
  "WEBSITE",
  "WALK_IN",
  "FACEBOOK",
  "INSTAGRAM",
  "WHATSAPP",
  "REFERRAL",
  "EVENT",
  "OTHER",
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type Contact = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  preferredDestination: string | null;
  interestedService: string | null;
  remarks: string | null;
  status: ContactStatus;
  leadSource: LeadSource | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactInput = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  preferredDestination?: string;
  interestedService?: string;
  remarks?: string;
  status?: ContactStatus;
  leadSource?: LeadSource;
};

export type UpdateContactInput = Partial<CreateContactInput>;
