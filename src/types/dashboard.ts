export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperiences: number;
  totalMessages: number;
}

export interface DashboardActivity {
  id: string;
  message: string;
  createdAt: string;
}

export interface DashboardChartData {
  name: string;
  value: number;
}
