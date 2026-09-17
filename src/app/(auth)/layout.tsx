import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] p-4 z-0">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors group bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 dark:border-white/10">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md z-10 relative">
        {/* Background glow effect for the form container */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-30"></div>
        
        {/* Main Card */}
        <div className="relative bg-white/80 dark:bg-[#0E1015]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
