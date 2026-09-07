import { fetchApi } from '@/lib/fetchApi';
import { Blog, CreateBlogDto, UpdateBlogDto } from '@/types/blog';
import { ApiResponse, QueryParams } from '@/types/common';

export const BlogService = {
  createBlog: async (data: CreateBlogDto): Promise<ApiResponse<Blog>> => {
    const res = await fetchApi.post<ApiResponse<Blog>>('/blogs', data);
    return res.data;
  },

  getBlogs: async (params?: QueryParams): Promise<ApiResponse<Blog[]>> => {
    const res = await fetchApi.get<ApiResponse<Blog[]>>('/blogs', { params });
    return res.data;
  },

  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const res = await fetchApi.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return res.data;
  },

  updateBlog: async (id: string, data: UpdateBlogDto): Promise<ApiResponse<Blog>> => {
    const res = await fetchApi.patch<ApiResponse<Blog>>(`/blogs/${id}`, data);
    return res.data;
  },

  deleteBlog: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/blogs/${id}`);
    return res.data;
  },
};
