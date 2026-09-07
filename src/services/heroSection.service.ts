import { fetchApi } from '@/lib/fetchApi';
import { HeroSection, CreateHeroSectionDto, UpdateHeroSectionDto } from '@/types/heroSection';
import { ApiResponse } from '@/types/common';

export const HeroSectionService = {
  getHeroSection: async (): Promise<ApiResponse<HeroSection>> => {
    const res = await fetchApi.get<ApiResponse<HeroSection>>('/hero-section');
    return res.data;
  },
  createHeroSection: async (data: CreateHeroSectionDto): Promise<ApiResponse<HeroSection>> => {
    const res = await fetchApi.post<ApiResponse<HeroSection>>('/hero-section', data);
    return res.data;
  },
  updateHeroSection: async (id: string, data: UpdateHeroSectionDto): Promise<ApiResponse<HeroSection>> => {
    const res = await fetchApi.patch<ApiResponse<HeroSection>>(`/hero-section/${id}`, data);
    return res.data;
  },
};
