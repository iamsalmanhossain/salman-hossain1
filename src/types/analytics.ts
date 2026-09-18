

export interface VisitorAnalytics {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  page: string;
  createdAt: string;
}

export type CreateVisitorAnalyticsDto = Omit<VisitorAnalytics, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVisitorAnalyticsDto = Partial<CreateVisitorAnalyticsDto>;
