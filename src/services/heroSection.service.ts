import { fetchApi } from '@/lib/fetchApi';
import { HeroSection, CreateHeroSectionDto, UpdateHeroSectionDto } from '@/types/heroSection';
import { ApiResponse } from '@/types/common';

export const HeroSectionService = {
  getHeroSection: async (): Promise<ApiResponse<HeroSection>> => {
    const res = await fetchApi.get<ApiResponse<HeroSection[]>>('/hero');
    return {
      ...res.data,
      data: res.data.data && res.data.data.length > 0 ? res.data.data[0] : (null as any)
    };
  },
  createHeroSection: async (data: CreateHeroSectionDto): Promise<ApiResponse<HeroSection>> => {
    const res = await fetchApi.post<ApiResponse<HeroSection>>('/hero', data);
    return res.data;
  },
  updateHeroSection: async (id: string, data: UpdateHeroSectionDto): Promise<ApiResponse<HeroSection>> => {
    const res = await fetchApi.patch<ApiResponse<HeroSection>>(`/hero/${id}`, data);
    return res.data;
  },
};
