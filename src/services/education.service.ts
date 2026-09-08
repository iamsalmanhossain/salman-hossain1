import { fetchApi } from '@/lib/fetchApi';
import { Education, CreateEducationDto, UpdateEducationDto } from '@/types/education';
import { ApiResponse, QueryParams } from '@/types/common';

export const EducationService = {
  createEducation: async (data: CreateEducationDto): Promise<ApiResponse<Education>> => {
    const res = await fetchApi.post<ApiResponse<Education>>('/educations', data);
    return res.data;
  },

  getEducations: async (params?: QueryParams): Promise<ApiResponse<Education[]>> => {
    const res = await fetchApi.get<ApiResponse<Education[]>>('/educations', { params });
    return res.data;
  },

  updateEducation: async (id: string, data: UpdateEducationDto): Promise<ApiResponse<Education>> => {
    const res = await fetchApi.patch<ApiResponse<Education>>(`/educations/${id}`, data);
    return res.data;
  },

  deleteEducation: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/educations/${id}`);
    return res.data;
  },
};
