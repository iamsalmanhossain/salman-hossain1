import { fetchApi } from '@/lib/fetchApi';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/types/testimonial';
import { ApiResponse, QueryParams } from '@/types/common';

export const TestimonialService = {
  createTestimonial: async (data: CreateTestimonialDto): Promise<ApiResponse<Testimonial>> => {
    const res = await fetchApi.post<ApiResponse<Testimonial>>('/testimonials', data);
    return res.data;
  },
  getTestimonials: async (params?: QueryParams): Promise<ApiResponse<Testimonial[]>> => {
    const res = await fetchApi.get<ApiResponse<Testimonial[]>>('/testimonials', { params });
    return res.data;
  },
  updateTestimonial: async (id: string, data: UpdateTestimonialDto): Promise<ApiResponse<Testimonial>> => {
    const res = await fetchApi.patch<ApiResponse<Testimonial>>(`/testimonials/${id}`, data);
    return res.data;
  },
  deleteTestimonial: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/testimonials/${id}`);
    return res.data;
  },
};
