import { fetchApi } from '@/lib/fetchApi';
import { Certificate, CreateCertificateDto, UpdateCertificateDto } from '@/types/certificate';
import { ApiResponse, QueryParams } from '@/types/common';

export const CertificateService = {
  createCertificate: async (data: CreateCertificateDto): Promise<ApiResponse<Certificate>> => {
    const res = await fetchApi.post<ApiResponse<Certificate>>('/certificates', data);
    return res.data;
  },
  getCertificates: async (params?: QueryParams): Promise<ApiResponse<Certificate[]>> => {
    const res = await fetchApi.get<ApiResponse<Certificate[]>>('/certificates', { params });
    return res.data;
  },
  updateCertificate: async (id: string, data: UpdateCertificateDto): Promise<ApiResponse<Certificate>> => {
    const res = await fetchApi.patch<ApiResponse<Certificate>>(`/certificates/${id}`, data);
    return res.data;
  },
  deleteCertificate: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetchApi.delete<ApiResponse<null>>(`/certificates/${id}`);
    return res.data;
  },
};
