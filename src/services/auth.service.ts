import { fetchApi } from '@/lib/fetchApi';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  VerifyEmailCredentials,
  User,
} from '@/types/auth';
import { ApiResponse } from '@/types/common';

export const AuthService = {
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const res = await fetchApi.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  verifyEmail: async (data: VerifyEmailCredentials): Promise<ApiResponse> => {
    const res = await fetchApi.post<ApiResponse>('/auth/verify-email', data);
    return res.data;
  },

  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const res = await fetchApi.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordCredentials): Promise<ApiResponse> => {
    const res = await fetchApi.post<ApiResponse>('/auth/forgot-password', data);
    return res.data;
  },

  verifyForgotPasswordOtp: async (data: VerifyEmailCredentials): Promise<ApiResponse> => {
    const res = await fetchApi.post<ApiResponse>('/auth/verify-forgot-password-otp', data);
    return res.data;
  },

  resetPassword: async (resetToken: string, data: ResetPasswordCredentials): Promise<ApiResponse> => {
    const res = await fetchApi.post<ApiResponse>(`/auth/reset-password/${resetToken}`, data);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await fetchApi.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
