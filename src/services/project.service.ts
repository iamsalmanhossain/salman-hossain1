import { fetchApi } from '@/lib/fetchApi';
import { Project, CreateProjectDto, UpdateProjectDto } from '@/types/project';
import { ApiResponse, QueryParams } from '@/types/common';

export const ProjectService = {
  createProject: async (data: CreateProjectDto): Promise<ApiResponse<Project>> => {
    const res = await fetchApi.post<ApiResponse<Project>>('/projects', data);
    return res.data;
  },

  getProjects: async (params?: QueryParams): Promise<ApiResponse<Project[]>> => {
    const res = await fetchApi.get<ApiResponse<Project[]>>('/projects', { params });
    return res.data;
  },

  getProjectById: async (id: string): Promise<ApiResponse<Project>> => {
    const res = await fetchApi.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data;
  },

  updateProject: async (id: string, data: UpdateProjectDto): Promise<ApiResponse<Project>> => {
    const res = await fetchApi.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data;
  },

  deleteProject: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/projects/${id}`);
    return res.data;
  },
};
