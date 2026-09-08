// c:\Portfolio\salman\src\types\auth.ts

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}



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
