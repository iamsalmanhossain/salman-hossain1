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
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { HeroSectionService } from "@/services/heroSection.service";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(pathname === "/about" ? "/about" : "#home");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: heroData } = useQuery({
    queryKey: ["hero"],
    queryFn: HeroSectionService.getHeroSection,
  });
  
  const heroName = heroData?.data?.heroTitle || "Salman";
  const initial = heroName.charAt(0).toUpperCase();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };
    handleResize();
    const handleScroll = () => {
      const sections = ['contact', 'blog', 'projects', 'experience', 'skills', 'about', 'home'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          if (pathname === '/') {
            setActiveSection(`#${section}`);
          }
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname);
    } else {
      setActiveSection("#home");
    }
  }, [pathname]);

  const getHref = (name: string, defaultHref: string) => {
    if (name === "About") return "/about";
    if (pathname === "/") return defaultHref;
    return `/${defaultHref}`;
  };

  const navItems = [
    { name: "Home", icon: Home, href: getHref("Home", "#home") },
    { name: "About", icon: User, href: "/about" },
    { name: "Skills", icon: Code, href: getHref("Skills", "#skills") },
    { name: "Experience", icon: Briefcase, href: "/experience" },
    { name: "Projects", icon: FolderGit2, href: getHref("Projects", "#projects") },
    { name: "Contact", icon: Mail, href: getHref("Contact", "#contact") },
  ];

  const mobileNavItems = navItems.filter(item => item.name !== 'Contact');
  const activeMobileIndex = mobileNavItems.findIndex(item => item.href === activeSection) !== -1 
    ? mobileNavItems.findIndex(item => item.href === activeSection) 
    : 0;

  return (
    <>
      {/* Mobile Top Right Actions */}
      <div className="md:hidden fixed top-4 right-4 z-[999] flex items-center gap-3">
        <Link href="#contact" className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm shadow-lg border border-transparent dark:border-white/10 transition-colors flex items-center gap-2">
          Let's Talk
          <ArrowUpRight className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 bg-white/80 dark:bg-[#1A1C23]/80 backdrop-blur-xl rounded-full text-black dark:text-white shadow-lg border border-gray-200 dark:border-white/10"
        >
          {mounted && theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Bottom Navigation (Curved Gooey Nav) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] h-20 bg-white dark:bg-[#1A1C23] shadow-[0_-4px_32px_rgba(0,0,0,0.1)] flex items-center px-4 rounded-t-3xl">
        
        {/* Active Indicator */}
        <div 
          className="absolute top-0 h-full transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] flex justify-center w-[calc((100%-2rem)/5)]"
          style={{ transform: `translateX(${activeMobileIndex * 100}%)` }}
        >
          {/* Raised Circle */}
          <div className="absolute -top-7 w-14 h-14 bg-white dark:bg-[#1A1C23] rounded-full border-[6px] border-gray-50 dark:border-black shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center" />
          
          {/* Left Curve */}
          <div className="absolute top-[2px] -left-5 w-5 h-5 bg-transparent rounded-tr-xl shadow-[0_-10px_0_0_#ffffff] dark:shadow-[0_-10px_0_0_#1A1C23]" />
          
          {/* Right Curve */}
          <div className="absolute top-[2px] -right-5 w-5 h-5 bg-transparent rounded-tl-xl shadow-[0_-10px_0_0_#ffffff] dark:shadow-[0_-10px_0_0_#1A1C23]" />
        </div>

        {/* Icons */}
        <div className="relative w-full h-full flex justify-between">
          {mobileNavItems.map((item, index) => {
            const isActive = index === activeMobileIndex;
            return (
              <Link 
                key={index}
                href={item.href}
                onClick={() => setActiveSection(item.href)}
                className="relative w-full h-full flex flex-col items-center justify-center z-10"
              >
                <span className={`transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] flex flex-col items-center gap-1 ${isActive ? '-translate-y-7 text-black dark:text-white drop-shadow-md' : 'translate-y-0 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}>
                  <item.icon className="w-6 h-6" />
                </span>
                {isActive && (
                   <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 240 : 80
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        className="hidden md:flex fixed left-0 top-0 h-screen bg-white/60 dark:bg-[#0E1015]/60 backdrop-blur-xl border-r border-black/5 dark:border-white/5 flex-col z-[999] overflow-visible transition-colors duration-300 shadow-2xl"
      >
        {/* Top Section - Logo & Toggle */}
        <div className="flex items-center justify-between p-4 h-20 relative">
          <div className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 w-0 hidden md:flex"}`}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white dark:text-black font-bold text-lg shrink-0 shadow-lg">
              {initial}
            </div>
            {isExpanded && <span className="font-bold text-black dark:text-white text-xl">{"{ "}{initial}{" }"}</span>}
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 bg-white dark:bg-[#1A1C23] rounded-md text-black dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex shrink-0 ${!isExpanded ? "mx-auto" : "ml-auto"}`}
          >
            {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.href} 
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all group relative"
                >
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
                  {!isExpanded && (
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
            {!isExpanded && (
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
