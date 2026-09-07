import { fetchApi } from '@/lib/fetchApi';
import { Skill, CreateSkillDto, UpdateSkillDto } from '@/types/skill';
import { ApiResponse, QueryParams } from '@/types/common';

export const SkillService = {
  createSkill: async (data: CreateSkillDto): Promise<ApiResponse<Skill>> => {
    const res = await fetchApi.post<ApiResponse<Skill>>('/skills', data);
    return res.data;
  },

  getSkills: async (params?: QueryParams): Promise<ApiResponse<Skill[]>> => {
    const res = await fetchApi.get<ApiResponse<Skill[]>>('/skills', { params });
    return res.data;
  },

  updateSkill: async (id: string, data: UpdateSkillDto): Promise<ApiResponse<Skill>> => {
    const res = await fetchApi.patch<ApiResponse<Skill>>(`/skills/${id}`, data);
    return res.data;
  },

  deleteSkill: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/skills/${id}`);
    return res.data;
  },
};
