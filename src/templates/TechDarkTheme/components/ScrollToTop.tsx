"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      
      if (height > 0) {
        setScrollProgress((scrollY / height) * 100);
      }
      
      // Show button after scrolling down 300px
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case the page is reloaded halfway down
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG Circle properties
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-28 right-4 lg:bottom-10 lg:right-10 z-[90] cursor-pointer group"
          onClick={scrollToTop}
        >
          <div className="relative w-14 h-14 flex items-center justify-center bg-[#111] backdrop-blur-xl rounded-full shadow-2xl border border-white/5 transition-all duration-300 hover:bg-[#222]">
            {/* SVG Progress Circle */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              width="56"
              height="56"
              viewBox="0 0 56 56"
            >
              {/* Background track */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-white/10"
                strokeWidth="2"
                fill="none"
              />
              {/* Progress track */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-white"
                strokeWidth="2"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
              />
            </svg>
            
            {/* Arrow Icon */}
            <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform duration-300" />
            
            {/* Tooltip */}
            <span className="absolute right-16 px-3 py-1.5 rounded-md bg-white text-black text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none hidden lg:block">
              Back to Top
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
