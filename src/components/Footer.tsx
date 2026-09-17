"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-[#0A0A0A]/50 backdrop-blur-sm z-10 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          © {currentYear} Salman Hossain. All rights reserved.
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
          Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using Next.js & Tailwind
        </p>

      </div>
    </footer>
  );
}
