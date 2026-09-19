export interface DashboardStats {
  totalViews: number;
  totalProjects: number;
  totalMessages: number;
  activeVisitors: number;
}

export interface DashboardActivity {
  id: number;
  action: string;
  date: string;
}

export interface DashboardChartData {
  name: string;
  value: number;
}
