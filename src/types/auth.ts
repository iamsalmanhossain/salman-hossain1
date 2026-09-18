import { UserStatus } from './common';
// c:\Portfolio\salman\src\types\auth.ts

export type UserRole = 'ADMIN' | 'USER';





// UserLoginSchema এর উপর ভিত্তি করে
export interface LoginCredentials {
  email: string;
  password: string;
}

// RegisterSchema এর উপর ভিত্তি করে
export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

// Forgot Password
export interface ForgotPasswordCredentials {
  email: string;
}

// Reset Password
export interface ResetPasswordCredentials {
  newPassword: string;
  confirmNewPassword: string;
}

// EmailVerifySchema এর উপর ভিত্তি করে
export interface VerifyEmailCredentials {
  email: string;
  otp: string;
}

// ResendOtpSchema এর উপর ভিত্তি করে
export interface ResendOtpCredentials {
  email: string;
}

// Auth API থেকে যে Response আসবে তার টাইপ
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
  };
}

export interface Session {
  id: string;
  userId: string;
  sessionId: string;
  refreshToken: string;
  deviceInfo?: string;
  ipAddress?: string;
  expiresAt: string;
  createdAt: string;
  user: User;
}

export type CreateSessionDto = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSessionDto = Partial<CreateSessionDto>;

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  status: UserStatus;
  deletedAt?: string;
  deleteAfter?: string;
  createdAt: string;
  updatedAt: string;
  sessions: Session[];
}

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;
