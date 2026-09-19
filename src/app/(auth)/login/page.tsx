"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const res = await AuthService.login(data);
      if (res.success && res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        // proxy.ts (middleware) যেন টোকেনটি পড়তে পারে তার জন্য কুকিতে সেভ করা হচ্ছে
        document.cookie = `token=${res.data.accessToken}; path=/; max-age=604800; SameSite=Lax`; 
        router.push("/dashboard");
      } else {
        setError(res.message || "Failed to login. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2 tracking-tight">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to access your dashboard</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email Address</label>
          <div className="relative group">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="email"
              placeholder="salman@hero.com"
              {...register("email")}
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1A1C23] border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-200 dark:border-white/5 focus:border-blue-500 focus:ring-blue-500/20'
              } text-black dark:text-white placeholder-gray-500`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Password</label>
            <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</a>
          </div>
          <div className="relative group">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1A1C23] border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500/20' 
                  : 'border-gray-200 dark:border-white/5 focus:border-blue-500 focus:ring-blue-500/20'
              } text-black dark:text-white placeholder-gray-500`}
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-3.5 bg-gradient-to-r from-blue-500 to-emerald-400 hover:from-blue-600 hover:to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <LogIn className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

    </div>
  );
}
