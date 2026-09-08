import { fetchApi } from '@/lib/fetchApi';
import { Service, CreateServiceDto, UpdateServiceDto } from '@/types/service';
import { ApiResponse, QueryParams } from '@/types/common';

export const ServicesService = {
  createService: async (data: CreateServiceDto): Promise<ApiResponse<Service>> => {
    const res = await fetchApi.post<ApiResponse<Service>>('/services', data);
    return res.data;
  },
  getServices: async (params?: QueryParams): Promise<ApiResponse<Service[]>> => {
    const res = await fetchApi.get<ApiResponse<Service[]>>('/services', { params });
    return res.data;
  },
  updateService: async (id: string, data: UpdateServiceDto): Promise<ApiResponse<Service>> => {
    const res = await fetchApi.patch<ApiResponse<Service>>(`/services/${id}`, data);
    return res.data;
  },
  deleteService: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/services/${id}`);
    return res.data;
  },
};
