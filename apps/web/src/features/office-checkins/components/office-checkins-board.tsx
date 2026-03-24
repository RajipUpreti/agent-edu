"use client";

import { OfficeCheckinPageClient } from '@/features/office-checkins/components/office-checkin-page-client';
import type {
  OfficeCheckinDashboardQuery,
  OfficeCheckinGroupedBuckets,
  OfficeCheckinOptions,
} from '@/features/office-checkins/types';

type OfficeCheckinsBoardProps = {
  initialGrouped: OfficeCheckinGroupedBuckets;
  options: OfficeCheckinOptions;
  initialQuery: OfficeCheckinDashboardQuery;
};

export function OfficeCheckinsBoard(props: OfficeCheckinsBoardProps) {
  return <OfficeCheckinPageClient {...props} />;
}
