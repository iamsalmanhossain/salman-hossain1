"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ReactQueryProvider>
        <AuthProvider>
          {isHomePage && <Sidebar />}
          <main className={`flex-1 transition-all duration-300 w-full ${isHomePage ? "md:pl-20" : ""}`}>
            {children}
          </main>
        </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
