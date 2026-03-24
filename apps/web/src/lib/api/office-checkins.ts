import { requestJson } from '@/lib/api/http';
import type {
  GetOfficeCheckinsParams,
  OfficeCheckin,
  OfficeCheckinGroupedBuckets,
  OfficeCheckinOptions,
  OfficeCheckinStatus,
  OfficeCheckinVisitorLookupResult,
} from '@/features/office-checkins/types';

export async function getOfficeCheckins(params: GetOfficeCheckinsParams = {}) {
  const query = new URLSearchParams();

  if (params.branchId) {
    query.set('branchId', params.branchId);
  }

  if (params.date) {
    query.set('date', params.date);
  }

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  if (typeof params.showCompleted === 'boolean') {
    query.set('showCompleted', String(params.showCompleted));
  }

  if (params.page) {
    query.set('page', String(params.page));
  }

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  const suffix = query.toString();
  return requestJson<OfficeCheckin[]>(`/office-checkins${suffix ? `?${suffix}` : ''}`, {
    cache: 'no-store',
  });
}

export async function getGroupedOfficeCheckins(params: GetOfficeCheckinsParams = {}) {
  const query = new URLSearchParams();

  if (params.branchId) {
    query.set('branchId', params.branchId);
  }

  if (params.date) {
    query.set('date', params.date);
  }

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  if (typeof params.showCompleted === 'boolean') {
    query.set('showCompleted', String(params.showCompleted));
  }

  if (params.page) {
    query.set('page', String(params.page));
  }

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  const suffix = query.toString();
  return requestJson<OfficeCheckinGroupedBuckets>(
    `/office-checkins/dashboard/grouped${suffix ? `?${suffix}` : ''}`,
    {
      cache: 'no-store',
    },
  );
}

export async function getOfficeCheckinOptions() {
  return requestJson<OfficeCheckinOptions>('/office-checkins/options', {
    cache: 'no-store',
  });
}

export async function lookupOfficeCheckinVisitors(input: {
  q: string;
  limit?: number;
}) {
  const query = new URLSearchParams();
  query.set('q', input.q.trim());

  if (input.limit) {
    query.set('limit', String(input.limit));
  }

  return requestJson<OfficeCheckinVisitorLookupResult[]>(
    `/office-checkins/visitor-lookup?${query.toString()}`,
    {
      cache: 'no-store',
    },
  );
}

export async function createOfficeCheckin(input: {
  branchId: string;
  contactId?: string;
  hostId?: string;
  createdById?: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  visitPurpose?: string;
  notes?: string;
}) {
  return requestJson<OfficeCheckin>('/office-checkins', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateOfficeCheckinStatus(id: string, status: OfficeCheckinStatus) {
  return requestJson<OfficeCheckin>(`/office-checkins/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function assignOfficeCheckinHost(id: string, hostId: string | null) {
  return requestJson<OfficeCheckin>(`/office-checkins/${id}/assign-host`, {
    method: 'PATCH',
    body: JSON.stringify({ hostId }),
  });
}
