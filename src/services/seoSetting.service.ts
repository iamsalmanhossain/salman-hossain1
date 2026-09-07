import { fetchApi } from '@/lib/fetchApi';
import { SeoSetting, CreateSeoSettingDto, UpdateSeoSettingDto } from '@/types/seoSetting';
import { ApiResponse } from '@/types/common';

export const SeoSettingService = {
  getSeoSetting: async (): Promise<ApiResponse<SeoSetting>> => {
    const res = await fetchApi.get<ApiResponse<SeoSetting>>('/seo-settings');
    return res.data;
  },
  createSeoSetting: async (data: CreateSeoSettingDto): Promise<ApiResponse<SeoSetting>> => {
    const res = await fetchApi.post<ApiResponse<SeoSetting>>('/seo-settings', data);
    return res.data;
  },
  updateSeoSetting: async (id: string, data: UpdateSeoSettingDto): Promise<ApiResponse<SeoSetting>> => {
    const res = await fetchApi.patch<ApiResponse<SeoSetting>>(`/seo-settings/${id}`, data);
    return res.data;
  },
};
