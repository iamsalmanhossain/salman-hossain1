import { fetchApi } from '@/lib/fetchApi';
import { DashboardStats, DashboardActivity, DashboardChartData } from '@/types/dashboard';
import { ApiResponse } from '@/types/common';

export const DashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await fetchApi.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data;
  },

  getActivities: async (): Promise<ApiResponse<DashboardActivity[]>> => {
    const res = await fetchApi.get<ApiResponse<DashboardActivity[]>>('/dashboard/activities');
    return res.data;
  },

  getChartData: async (): Promise<ApiResponse<DashboardChartData[]>> => {
    const res = await fetchApi.get<ApiResponse<DashboardChartData[]>>('/dashboard/chart');
    return res.data;
  },
};
