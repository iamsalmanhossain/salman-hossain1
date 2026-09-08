import { fetchApi } from '@/lib/fetchApi';
import { SocialLink, CreateSocialLinkDto, UpdateSocialLinkDto } from '@/types/socialLinks';
import { ApiResponse, QueryParams } from '@/types/common';

export const SocialLinksService = {
  createSocialLink: async (data: CreateSocialLinkDto): Promise<ApiResponse<SocialLink>> => {
    const res = await fetchApi.post<ApiResponse<SocialLink>>('/social-links', data);
    return res.data;
  },
  getSocialLinks: async (params?: QueryParams): Promise<ApiResponse<SocialLink[]>> => {
    const res = await fetchApi.get<ApiResponse<SocialLink[]>>('/social-links', { params });
    return res.data;
  },
  updateSocialLink: async (id: string, data: UpdateSocialLinkDto): Promise<ApiResponse<SocialLink>> => {
    const res = await fetchApi.patch<ApiResponse<SocialLink>>(`/social-links/${id}`, data);
    return res.data;
  },
  deleteSocialLink: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/social-links/${id}`);
    return res.data;
  },
};
