"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { 
  LayoutDashboard, 
  Settings, 
  FolderGit2, 
  Briefcase, 
  GraduationCap,
  FileText,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Code,
  Award,
  Package,
  MessageSquare,
  Link as LinkIcon,
  Tags,
  Search,
  Type
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { accessToken, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Basic route protection
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else if (isSidebarOpen === false && window.innerWidth >= 1024) {
        // Keep user's preference if they already toggled it, or open by default
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Hero Section", icon: Type, href: "/dashboard/hero" },
    { name: "Skills", icon: Code, href: "/dashboard/skills" },
    { name: "Experience", icon: Briefcase, href: "/dashboard/experience" },
    { name: "Education", icon: GraduationCap, href: "/dashboard/education" },
    { name: "Services", icon: Package, href: "/dashboard/services" },
    { name: "Projects", icon: FolderGit2, href: "/dashboard/projects" },
    { name: "Categories", icon: Tags, href: "/dashboard/project-categories" },
    { name: "Certificates", icon: Award, href: "/dashboard/certificates" },
    { name: "Blog Posts", icon: FileText, href: "/dashboard/blogs" },
    { name: "Testimonials", icon: MessageSquare, href: "/dashboard/testimonials" },
    { name: "Social Links", icon: LinkIcon, href: "/dashboard/social-links" },
    { name: "SEO Settings", icon: Search, href: "/dashboard/seo-settings" },
  ];

  if (!accessToken) return null; // Prevent flicker before redirect

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex h-screen bg-gray-50 dark:bg-[#0A0A0A] overflow-hidden text-black dark:text-white">
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`fixed lg:static top-0 left-0 h-full bg-white dark:bg-[#1A1C23] border-r border-gray-200 dark:border-white/10 z-50 flex flex-col transition-all duration-300 shrink-0 ${
            isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
          }`}
        >
          <div className={`h-16 flex items-center border-b border-gray-200 dark:border-white/10 shrink-0 ${isSidebarOpen ? 'justify-between px-6' : 'lg:justify-center px-6 lg:px-0 justify-between'}`}>
            <h2 className={`text-xl font-bold text-black dark:text-white whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:hidden'}`}>
              Admin Panel
            </h2>
            {!isSidebarOpen && <h2 className="text-xl font-bold text-black dark:text-white hidden lg:block">AP</h2>}
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 overflow-x-hidden">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={index}
                  href={item.href}
                  title={!isSidebarOpen ? item.name : undefined}
                  className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-300 ${isSidebarOpen ? 'px-4' : 'lg:justify-center px-4 lg:px-0'} ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  }`}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:hidden'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-white/10 shrink-0 overflow-x-hidden">
            <div className={`flex items-center gap-3 py-3 bg-gray-100 dark:bg-white/5 rounded-xl mb-4 transition-all duration-300 ${isSidebarOpen ? 'px-4' : 'lg:justify-center lg:bg-transparent px-4 lg:px-0'}`}>
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'lg:opacity-0 lg:w-0 lg:hidden'}`}>
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              title={!isSidebarOpen ? "Logout" : undefined}
              className={`flex items-center justify-center gap-2 w-full py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl font-medium transition-colors ${isSidebarOpen ? 'px-4' : 'lg:px-0'}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:hidden'}`}>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Topbar */}
          <header className="h-16 bg-white dark:bg-[#1A1C23] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <h1 className="text-xl font-semibold hidden sm:block">Dashboard Overview</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-blue-500 hover:text-blue-600">
                View Live Site &rarr;
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50 dark:bg-[#0A0A0A]">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
