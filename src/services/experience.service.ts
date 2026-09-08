import { fetchApi } from '@/lib/fetchApi';
import { Experience, CreateExperienceDto, UpdateExperienceDto } from '@/types/experience';
import { ApiResponse, QueryParams } from '@/types/common';

export const ExperienceService = {
  createExperience: async (data: CreateExperienceDto): Promise<ApiResponse<Experience>> => {
    const res = await fetchApi.post<ApiResponse<Experience>>('/experiences', data);
    return res.data;
  },

  getExperiences: async (params?: QueryParams): Promise<ApiResponse<Experience[]>> => {
    const res = await fetchApi.get<ApiResponse<Experience[]>>('/experiences', { params });
    return res.data;
  },

  updateExperience: async (id: string, data: UpdateExperienceDto): Promise<ApiResponse<Experience>> => {
    const res = await fetchApi.patch<ApiResponse<Experience>>(`/experiences/${id}`, data);
    return res.data;
  },

  deleteExperience: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/experiences/${id}`);
    return res.data;
  },
};
