"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { accessToken, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          // Verify token by fetching user profile
          const res = await AuthService.getMe();
          if (!res.success) {
            logout();
          }
        } catch (error) {
          // On 401, the fetchApi wrapper handles refresh or logout automatically
          console.error("Auth init error:", error);
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, [accessToken, logout]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
