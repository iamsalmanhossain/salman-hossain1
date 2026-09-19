import { fetchApi } from '@/lib/fetchApi';

export const VisitorAnalyticsService = {
  trackVisit: async (page: string): Promise<any> => {
    try {
      const res = await fetchApi.post('/visitor-analytics', { page });
      return res;
    } catch (error) {
      console.error('Failed to track visit', error);
      return null;
    }
  },
};
