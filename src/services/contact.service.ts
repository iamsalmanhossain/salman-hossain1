import { fetchApi } from '@/lib/fetchApi';
import { ContactMessage, SendMessageDto } from '@/types/contact';
import { ApiResponse, QueryParams } from '@/types/common';

export const ContactService = {
  sendMessage: async (data: SendMessageDto): Promise<ApiResponse<ContactMessage>> => {
    const res = await fetchApi.post<ApiResponse<ContactMessage>>('/contact', data);
    return res.data;
  },

  getMessages: async (params?: QueryParams): Promise<ApiResponse<ContactMessage[]>> => {
    const res = await fetchApi.get<ApiResponse<ContactMessage[]>>('/contact', { params });
    return res.data;
  },

  deleteMessage: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/contact/${id}`);
    return res.data;
  },
};
