import { fetchApi } from '@/lib/fetchApi';
import { AdminPortfolioTemplate, CreateAdminPortfolioTemplateDto, UpdateAdminPortfolioTemplateDto } from '@/types/adminPortfolio';

export const AdminPortfolioService = {
  // Public route to get the currently active template for the home page
  getActiveTemplate: async (): Promise<{ data: AdminPortfolioTemplate | null }> => {
    try {
      const res = await fetchApi.get<{ data: AdminPortfolioTemplate | null }>('/admin-portfolio/active');
      return res.data;
    } catch (error) {
      console.error("Failed to fetch active template:", error);
      return { data: null };
    }
  },

  // Admin route to get all templates
  getAllTemplates: async (): Promise<{ data: AdminPortfolioTemplate[] }> => {
    const res = await fetchApi.get<{ data: AdminPortfolioTemplate[] }>('/admin-portfolio');
    return res.data;
  },

  // Admin route to create a new template
  createTemplate: async (data: CreateAdminPortfolioTemplateDto): Promise<{ data: AdminPortfolioTemplate }> => {
    const res = await fetchApi.post<{ data: AdminPortfolioTemplate }>('/admin-portfolio', data);
    return res.data;
  },

  // Admin route to update a template (or set active)
  updateTemplate: async (id: string, data: UpdateAdminPortfolioTemplateDto): Promise<{ data: AdminPortfolioTemplate }> => {
    const res = await fetchApi.patch<{ data: AdminPortfolioTemplate }>(`/admin-portfolio/${id}`, data);
    return res.data;
  },

  // Admin route to delete a template
  deleteTemplate: async (id: string): Promise<{ data: AdminPortfolioTemplate }> => {
    const res = await fetchApi.delete<{ data: AdminPortfolioTemplate }>(`/admin-portfolio/${id}`);
    return res.data;
  }
};
