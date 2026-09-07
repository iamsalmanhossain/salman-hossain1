import { fetchApi } from '@/lib/fetchApi';
import { UploadResponse } from '@/types/upload';
import { ApiResponse } from '@/types/common';

export const UploadService = {
  uploadFile: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // fetchApi automatically handles FormData Content-Type
    const res = await fetchApi.post<ApiResponse<UploadResponse>>('/upload', formData);
    return res.data;
  },
};
