"use client";

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { AdminPortfolioService } from "@/services/adminPortfolio.service";
import { HeroSectionService } from "@/services/heroSection.service";
import { ProjectService } from "@/services/project.service";
import { ExperienceService } from "@/services/experience.service";
import { BlogService } from "@/services/blog.service";
import { SkillService } from "@/services/skill.service";
import { EducationService } from "@/services/education.service";
import { CertificateService } from "@/services/certificate.service";
import { TestimonialService } from "@/services/testimonial.service";
import { SocialLinksService } from "@/services/socialLinks.service";
import { SeoSettingService } from "@/services/seoSetting.service";
import { ProjectCategoryService } from "@/services/projectCategory.service";
import Preloader from "@/components/Preloader";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

import { TemplateRegistry } from "@/templates/TemplateRegistry";
import TechDarkTheme from "@/templates/TechDarkTheme/TechDarkTheme";
import { ServicesService } from "@/services/service.service";

function HomeContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const previewTemplateId = searchParams.get("previewTemplateId");
  const queryClient = useQueryClient();

  const [mounted, setMounted] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'REFRESH_DATA') {
        queryClient.invalidateQueries();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [queryClient]);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("portfolio_visited")) {
      setLoadingComplete(true);
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    sessionStorage.setItem("portfolio_visited", "true");
    setLoadingComplete(true);
  }, []);

  // Fetch the active template or preview template
  const { data: templateResponse, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['activeTemplate', previewTemplateId],
    queryFn: async () => {
      if (previewTemplateId) {
        // If previewing, we would ideally fetch by ID, but for now we fallback to the active one
        // or we could fetch all and find it, but let's just use the active template endpoint
        // Assuming there is an endpoint or we just ignore it if it's too complex.
        // Actually, we can fetch all templates if previewTemplateId is present (requires admin auth)
        if (typeof window !== 'undefined' && sessionStorage.getItem('auth-storage')) {
           const all = await AdminPortfolioService.getAllTemplates();
           return all;
        }
      }
      return AdminPortfolioService.getActiveTemplate();
    },
  });

  const activeTemplate = previewTemplateId && templateResponse?.data && Array.isArray(templateResponse.data)
    ? (templateResponse.data as any[]).find((t) => t.id === previewTemplateId)
    : (Array.isArray(templateResponse?.data) ? (templateResponse?.data as any[]).find(t => t.isActive) : templateResponse?.data);

  const websiteData = activeTemplate?.websiteData || {
    showHero: true,
    showAbout: true,
    showProjects: true,
    showBlog: true,
  };
 
  const queries = useQueries({
    queries: [
      { queryKey: ['hero'], queryFn: () => HeroSectionService.getHeroSection() },
      { queryKey: ['projects'], queryFn: () => ProjectService.getProjects() },
      { queryKey: ['experience'], queryFn: () => ExperienceService.getExperiences() },
      { queryKey: ['blogs'], queryFn: () => BlogService.getBlogs() },
      { queryKey: ['skills'], queryFn: () => SkillService.getSkills() },
      { queryKey: ['education'], queryFn: () => EducationService.getEducations() },
      { queryKey: ['services'], queryFn: () => ServicesService.getServices() },
      { queryKey: ['certificates'], queryFn: () => CertificateService.getCertificates() },
      { queryKey: ['testimonials'], queryFn: () => TestimonialService.getTestimonials() },
      { queryKey: ['socialLinks'], queryFn: () => SocialLinksService.getSocialLinks() },
      { queryKey: ['seoSetting'], queryFn: () => SeoSettingService.getSeoSetting() },
      { queryKey: ['projectCategories'], queryFn: () => ProjectCategoryService.getCategories() },
    ]
  });

  const isLoadingData = queries.some(q => q.isLoading) || isLoadingTemplate;

  // useEffect(() => {
  //   if (!isLoadingData) {
  //     console.log("=== All Fetched Data from Backend ===");
  //     console.log("Hero Section:", queries[0].data);
  //     console.log("Projects:", queries[1].data);
  //     console.log("Experience:", queries[2].data);
  //     console.log("Blogs:", queries[3].data);
  //     console.log("Skills:", queries[4].data);
  //     console.log("Education:", queries[5].data);
  //     console.log("Services:", queries[6].data);
  //     console.log("Certificates:", queries[7].data);
  //     console.log("Testimonials:", queries[8].data);
  //     console.log("Social Links:", queries[9].data);
  //     console.log("SEO Setting:", queries[10].data);
  //     console.log("Project Categories:", queries[11].data);
  //   }
  // }, [isLoadingData]);
  const isLight = mounted && theme === 'light';

  // ডায়নামিক টেমপ্লেট নির্বাচন
  const templateName = activeTemplate?.templateName || "Tech Dark Theme";
  const ActiveTemplateComponent = TemplateRegistry[templateName] || TechDarkTheme;

  return (
    <>
      <AnimatePresence>
        {!loadingComplete && (
          <Preloader isLoading={isLoadingData} onLoadingComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
      
      {loadingComplete && (
        <ActiveTemplateComponent 
          websiteData={websiteData} 
          isLight={isLight} 
          mounted={mounted} 
          activeTemplate={activeTemplate}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]" />}>
      <HomeContent />
    </Suspense>
  );
}
