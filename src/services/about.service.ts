import { fetchApi } from '@/lib/fetchApi';
import { ApiResponse, QueryParams } from '@/types/common';
import { IAbout, ICreateAbout, IUpdateAbout } from '../types/about';

export const getAboutSections = async (params?: QueryParams): Promise<ApiResponse<IAbout[]>> => {
    const res = await fetchApi.get<ApiResponse<IAbout[]>>('/about', { params });
    return res.data;
};

export const getAboutSectionById = async (id: string): Promise<ApiResponse<IAbout>> => {
    const res = await fetchApi.get<ApiResponse<IAbout>>(`/about/${id}`);
    return res.data;
};

export const createAboutSection = async (data: ICreateAbout): Promise<ApiResponse<IAbout>> => {
    const res = await fetchApi.post<ApiResponse<IAbout>>('/about', data);
    return res.data;
};

export const updateAboutSection = async (id: string, data: IUpdateAbout): Promise<ApiResponse<IAbout>> => {
    const res = await fetchApi.patch<ApiResponse<IAbout>>(`/about/${id}`, data);
    return res.data;
};

export const deleteAboutSection = async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/about/${id}`);
    return res.data;
};
