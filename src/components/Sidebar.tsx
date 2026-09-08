"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  User, 
  Code, 
  Briefcase, 
  FolderGit2, 
  FileText, 
  Mail,
  Menu,
  X,
  Moon,
  Sun,
  Globe,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", icon: Home, href: "#home" },
    { name: "About", icon: User, href: "#about" },
    { name: "Skills", icon: Code, href: "#skills" },
    { name: "Experience", icon: Briefcase, href: "#experience" },
    { name: "Projects", icon: FolderGit2, href: "#projects" },
    { name: "Blog", icon: FileText, href: "#blog" },
    { name: "Contact", icon: Mail, href: "#contact" },
  ];

  return (
    <>
      {/* Mobile Hamburger overlay button if collapsed */}
      {isMobile && !isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-[#1A1C23] rounded-md text-black dark:text-white border border-gray-200 dark:border-white/10 shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/60 z-[40] md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 240 : (isMobile ? 0 : 80),
          x: isMobile ? (isExpanded ? 0 : -240) : 0
        }}
        className="fixed left-0 top-0 h-screen bg-gray-50 dark:bg-[#0E1015] border-r border-gray-200 dark:border-white/5 flex flex-col z-[50] overflow-visible transition-colors duration-300"
      >
        {/* Top Section - Logo & Toggle */}
        <div className="flex items-center justify-between p-4 h-20 relative">
          <div className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 w-0 hidden md:flex"}`}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white dark:text-black font-bold text-lg shrink-0">
              A
            </div>
            {isExpanded && <span className="font-bold text-black dark:text-white text-xl">{"{ A }"}</span>}
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 bg-white dark:bg-[#1A1C23] rounded-md text-black dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors hidden md:flex shrink-0 ${!isExpanded ? "mx-auto" : "ml-auto"}`}
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {isMobile && isExpanded && (
             <button 
              onClick={() => setIsExpanded(false)}
              className="p-2 bg-white dark:bg-[#1A1C23] rounded-md text-black dark:text-white border border-gray-200 dark:border-white/10 shrink-0 ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all group relative">
                  <item.icon className="w-5 h-5 shrink-0 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors" />
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap font-medium text-sm"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && !isMobile && (
                    <div className="absolute left-14 bg-white dark:bg-[#1A1C23] text-black dark:text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-black/10 dark:border-white/10 z-[60] ml-2 shadow-lg">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <button className="flex items-center gap-4 px-3 py-2 w-full rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all group relative cursor-pointer">
            <Globe className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between flex-1 overflow-hidden"
                >
                  <span className="whitespace-nowrap font-medium text-sm">EN</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            {!isExpanded && !isMobile && (
               <div className="absolute left-14 bg-white dark:bg-[#1A1C23] text-black dark:text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-black/10 dark:border-white/10 z-[60] ml-2">
                 Language
               </div>
            )}
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-4 px-3 py-2 w-full rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all group relative cursor-pointer"
          >
            {mounted && theme === 'dark' ? <Moon className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
            <AnimatePresence>
              {isExpanded && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap font-medium text-sm"
                >
                  {mounted && theme === 'dark' ? "Light Mode" : "Dark Mode"}
                </motion.span>
              )}
            </AnimatePresence>
            {!isExpanded && !isMobile && (
               <div className="absolute left-14 bg-white dark:bg-[#1A1C23] text-black dark:text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-black/10 dark:border-white/10 z-[60] ml-2">
                 Theme
               </div>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
