import { fetchApi } from '@/lib/fetchApi';
import { ProjectCategory, CreateProjectCategoryDto, UpdateProjectCategoryDto } from '@/types/projectCategory';
import { ApiResponse, QueryParams } from '@/types/common';

export const ProjectCategoryService = {
  createCategory: async (data: CreateProjectCategoryDto): Promise<ApiResponse<ProjectCategory>> => {
    const res = await fetchApi.post<ApiResponse<ProjectCategory>>('/project-categories', data);
    return res.data;
  },
  getCategories: async (params?: QueryParams): Promise<ApiResponse<ProjectCategory[]>> => {
    const res = await fetchApi.get<ApiResponse<ProjectCategory[]>>('/project-categories', { params });
    return res.data;
  },
  updateCategory: async (id: string, data: UpdateProjectCategoryDto): Promise<ApiResponse<ProjectCategory>> => {
    const res = await fetchApi.patch<ApiResponse<ProjectCategory>>(`/project-categories/${id}`, data);
    return res.data;
  },
  deleteCategory: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/project-categories/${id}`);
    return res.data;
  },
};
