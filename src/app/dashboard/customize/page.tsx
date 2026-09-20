"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  CheckCircle, 
  Save, 
  Plus, 
  Trash2, 
  LayoutTemplate, 
  Sparkles, 
  Code, 
  Briefcase, 
  GraduationCap, 
  Package, 
  FolderGit2, 
  Tags, 
  Award, 
  FileText, 
  MessageSquare, 
  LinkIcon, 
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  User,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { TemplateRegistry } from "@/templates/TemplateRegistry";
import { AdminPortfolioTemplate } from "@/types/adminPortfolio";
import { WizardAccordion, WizardStep } from "./components/WizardAccordion";
import HeroPage from "../hero/page";
import AboutPage from "../about/page";
import SkillsPage from "../skills/page";
import ExperiencePage from "../experience/page";
import EducationPage from "../education/page";
import ServicesPage from "../services/page";
import ProjectsPage from "../projects/page";
import CertificatesPage from "../certificates/page";
import TestimonialsPage from "../testimonials/page";
import SocialLinksPage from "../social-links/page";
import { toast } from "sonner";

export default function CustomizeThemePage() {
  const queryClient = useQueryClient();
  const [expandedSection, setExpandedSection] = useState<number>(1);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<AdminPortfolioTemplate>>({
    templateName: "New Template",
    personalData: { themeStyle: "default", primaryColor: "#0ea5e9" },
    websiteData: { showHero: true, showAbout: true, showProjects: true, showBlog: true }
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      if (sidebarRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const newWidth = e.clientX - sidebarRect.left;
        setSidebarWidth(Math.max(320, Math.min(newWidth, 800)));
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; 
    } else {
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleRefreshPreview = () => {
    const iframe = document.getElementById("theme-preview-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('REFRESH_DATA', '*');
    }
    setRefreshCounter(prev => prev + 1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      // Mocked for now to match structure
      return { data: [{ id: "1", templateName: "Tech Dark Theme", personalData: { themeStyle: "default", primaryColor: "#0ea5e9" }, websiteData: { showHero: true, showAbout: true, showProjects: true, showBlog: true } }] };
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdminPortfolioTemplate> }) => {
      return { data: { ...data, id } };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      handleRefreshPreview();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update theme");
    }
  });

  const templates = data?.data || [];

  const handleSave = () => {
    if (selectedTemplateId && selectedTemplateId !== "new") {
      updateMutation.mutate({ id: selectedTemplateId, data: formData });
    } else {
      toast.info("Select a template to save changes");
    }
  };

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
    if (id === "new") {
      setFormData({
        templateName: "New Template",
        personalData: { themeStyle: "default", primaryColor: "#0ea5e9" },
        websiteData: { showHero: true, showAbout: true, showProjects: true, showBlog: true }
      });
    } else {
      const template = templates.find((t: any) => t.id === id);
      if (template) setFormData(template);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const previewUrl = selectedTemplateId && selectedTemplateId !== "new"
    ? `${baseUrl}/?previewTemplateId=${selectedTemplateId}`
    : baseUrl;

  const getPreviewWidth = () => {
    if (previewMode === "mobile") return "w-full max-w-[375px]";
    if (previewMode === "tablet") return "w-full max-w-[768px]";
    return "w-full max-w-full";
  };

  return (
    <div className="h-[calc(100vh-100px)] min-h-[700px] flex flex-col md:flex-row bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl ">

      {/* Left Sidebar - Theme Settings */}
      <div 
        ref={sidebarRef}
        className={`shrink-0 bg-white dark:bg-[#111111] flex flex-col z-20 ${!isDragging ? "transition-all duration-300 ease-in-out" : ""} border-r border-gray-200 dark:border-white/5 relative ${
          isSettingsCollapsed ? "w-0 overflow-hidden border-r-0 opacity-0" : "opacity-100"
        }`}
        style={{ width: isSettingsCollapsed ? 0 : (isMobile ? '100%' : sidebarWidth) }}
      >
        <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md sticky top-0 z-10 shrink-0 flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-blue-500" /> 
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Theme Editor
            </h2>
          </div>
          <button
            onClick={() => window.open(previewUrl, '_blank')}
            className="p-2 rounded-lg transition-all text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 dark:bg-[#111111]">
          <WizardAccordion>
            {/* STEP 1: Template & General Settings */}
            <WizardStep
              id={1}
              title="Template & Style"
              icon={LayoutTemplate}
              isExpanded={expandedSection === 1}
              onToggle={() => setExpandedSection(expandedSection === 1 ? 0 : 1)}
              onNext={() => {
                handleSave();
                setExpandedSection(2);
              }}
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select Design Template</label>
                  <select 
                    value={formData.templateName || "Tech Dark Theme"}
                    onChange={(e) => {
                      const updatedData = { ...formData, templateName: e.target.value, isActive: true };
                      setFormData(updatedData);
                      if (selectedTemplateId && selectedTemplateId !== "new") {
                        updateMutation.mutate({ id: selectedTemplateId, data: updatedData });
                      }
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                  >
                    <option value="Tech Dark Theme">Tech Dark Theme (Active)</option>
                    <option value="Minimal Light">Minimal Light (Coming Soon)</option>
                    <option value="Creative Portfolio">Creative Portfolio (Coming Soon)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Active Sections</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'showHero', label: 'Hero Section' },
                      { key: 'showAbout', label: 'About' },
                      { key: 'showProjects', label: 'Projects' },
                      { key: 'showBlog', label: 'Blog' }
                    ].map(({key, label}) => (
                      <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] cursor-pointer hover:border-blue-500/50 transition-colors">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            checked={formData.websiteData?.[key as keyof typeof formData.websiteData] as boolean}
                            onChange={(e) => {
                              const updated = {
                                ...formData,
                                websiteData: { ...formData.websiteData, [key]: e.target.checked }
                              };
                              setFormData(updated);
                              if (selectedTemplateId && selectedTemplateId !== "new") {
                                updateMutation.mutate({ id: selectedTemplateId, data: updated });
                              }
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </WizardStep>

            {/* STEP 2: Hero Section */}
            <WizardStep
              id={2}
              title="Hero Section"
              icon={Sparkles}
              isExpanded={expandedSection === 2}
              onToggle={() => setExpandedSection(expandedSection === 2 ? 0 : 2)}
              onNext={() => setExpandedSection(3)}
              hideNextButton={true}
            >
              <HeroPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(3);
              }} />
            </WizardStep>

            {/* STEP 3: About */}
            <WizardStep
              id={3}
              title="About"
              icon={User}
              isExpanded={expandedSection === 3}
              onToggle={() => setExpandedSection(expandedSection === 3 ? 0 : 3)}
              onNext={() => setExpandedSection(4)}
              hideNextButton={true}
            >
              <AboutPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(4);
              }} />
            </WizardStep>

            {/* STEP 4: Skills */}
            <WizardStep 
              id={4} 
              title="Skills" 
              icon={Code} 
              isExpanded={expandedSection === 4} 
              onToggle={() => setExpandedSection(expandedSection === 4 ? 0 : 4)} 
              onNext={() => setExpandedSection(5)}
            >
              <SkillsPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(5);
              }} />
            </WizardStep>
            {/* STEP 5: Experience */}
            <WizardStep id={5} title="Experience" icon={Briefcase} isExpanded={expandedSection === 5} onToggle={() => setExpandedSection(expandedSection === 5 ? 0 : 5)} onNext={() => setExpandedSection(6)}>
              <ExperiencePage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(6);
              }} />
            </WizardStep>
            {/* STEP 6: Education */}
            <WizardStep id={6} title="Education" icon={GraduationCap} isExpanded={expandedSection === 6} onToggle={() => setExpandedSection(expandedSection === 6 ? 0 : 6)} onNext={() => setExpandedSection(7)}>
              <EducationPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(7);
              }} />
            </WizardStep>
            {/* STEP 7: Services */}
            <WizardStep id={7} title="Services" icon={Package} isExpanded={expandedSection === 7} onToggle={() => setExpandedSection(expandedSection === 7 ? 0 : 7)} onNext={() => setExpandedSection(8)}>
              <ServicesPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(8); }} />
            </WizardStep>
            {/* STEP 8: Projects */}
            <WizardStep id={8} title="Projects" icon={FolderGit2} isExpanded={expandedSection === 8} onToggle={() => setExpandedSection(expandedSection === 8 ? 0 : 8)} onNext={() => setExpandedSection(9)}>
              <ProjectsPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(9); }} />
            </WizardStep>
            {/* STEP 9: Certificates */}
            <WizardStep id={9} title="Certificates" icon={Award} isExpanded={expandedSection === 9} onToggle={() => setExpandedSection(expandedSection === 9 ? 0 : 9)} onNext={() => setExpandedSection(10)}>
              <CertificatesPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(10); }} />
            </WizardStep>
            {/* STEP 10: Testimonials */}
            <WizardStep id={10} title="Testimonials" icon={MessageSquare} isExpanded={expandedSection === 10} onToggle={() => setExpandedSection(expandedSection === 10 ? 0 : 10)} onNext={() => setExpandedSection(11)}>
              <TestimonialsPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(11); }} />
            </WizardStep>
            {/* STEP 11: Social Links */}
            <WizardStep id={11} title="Social Links" icon={LinkIcon} isExpanded={expandedSection === 11} onToggle={() => setExpandedSection(expandedSection === 11 ? 0 : 11)} onNext={() => {
              handleRefreshPreview();
              toast.success("All sections completed!");
            }}>
              <SocialLinksPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                toast.success("Theme configuration saved!");
              }} />
            </WizardStep>
          </WizardAccordion>
        </div>
      </div>

      {/* Resize Handle */}
      {!isSettingsCollapsed && !isMobile && (
        <div 
          className="w-1 bg-gray-200 dark:bg-[#1A1A1A] hover:bg-blue-500 cursor-col-resize active:bg-blue-600 transition-colors z-30 flex justify-center items-center shrink-0 group relative border-l border-r border-gray-100 dark:border-white/5"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute inset-y-0 -left-2 -right-2 z-40 cursor-col-resize" />
          <div className="h-10 w-0.5 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-white transition-colors" />
        </div>
      )}

      {/* Right Content - Preview Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F5F5F7] dark:bg-[#050505] relative shadow-inner overflow-hidden ">

        {/* Dynamic dot grid background pattern */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        {/* Preview Topbar */}
        <div className="h-14 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
          
          {/* Left Side: Toggle Sidebar Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
              className="p-2 rounded-lg transition-all text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 flex items-center gap-2"
              title="Toggle Sidebar"
            >
              {isSettingsCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              <span className="text-sm font-medium hidden sm:block">{isSettingsCollapsed ? 'Open Editor' : 'Hide Editor'}</span>
            </button>
          </div>

          {/* Center: Device Previews */}
          <div className="flex items-center justify-center p-1 bg-gray-200/50 dark:bg-[#1A1A1A] rounded-lg absolute left-1/2 -translate-x-1/2 border border-gray-200 dark:border-white/5 shadow-inner ">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-white dark:bg-[#2A2A2A] text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("tablet")}
              className={`p-1.5 rounded-md transition-all ${previewMode === "tablet" ? "bg-white dark:bg-[#2A2A2A] text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
              title="Tablet Preview"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-white dark:bg-[#2A2A2A] text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Right Side: Refresh */}
          <div className="flex items-center">
            <button
              onClick={handleRefreshPreview}
              className="px-4 py-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Refresh Preview</span>
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
        </div>

        {/* Interactive Preview Container */}
        <div className="flex-1 overflow-auto flex items-start justify-center  custom-scrollbar relative z-10 w-full h-full ">
          <div 
            className={`bg-white dark:bg-[#0A0A0A] shadow-2xl overflow-hidden transition-all duration-500 ease-in-out border border-gray-300 dark:border-white/10 relative flex flex-col ${getPreviewWidth()}`}
            style={{ 
              height: '100%',
              minHeight: previewMode === 'desktop' ? '100%' : '800px',
              borderRadius: previewMode === 'desktop' ? '12px' : '36px',
            }}
          >
            {/* Device/Browser Header bar */}
            {previewMode === "desktop" ? (
              <div className="h-12 bg-[#E5E5E5] dark:bg-[#111111] border-b border-gray-300 dark:border-white/5 flex items-center px-4 shrink-0 relative">
                <div className="flex gap-2 absolute left-4">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm border border-black/10"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm border border-black/10"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm border border-black/10"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-1/2 max-w-[400px] h-7 bg-white dark:bg-[#1A1A1A] rounded-md border border-gray-300 dark:border-white/5 flex items-center justify-center px-3 shadow-inner">
                    <Search className="w-3 h-3 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">portfolio.preview</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-7 bg-black flex justify-center shrink-0 items-center relative z-20">
                 <div className="w-1/3 h-5 bg-[#111] rounded-b-2xl shadow-inner"></div>
              </div>
            )}
            
            <div className="flex-1 relative w-full h-full bg-white dark:bg-black">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <iframe
                  key={refreshCounter}
                  id="theme-preview-iframe"
                  src={previewUrl}
                  className={`w-full h-full border-0 absolute inset-0 ${isDragging ? "pointer-events-none" : ""}`}
                  title="Theme Preview"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )}
            </div>
            
            {/* Mobile bottom indicator */}
            {previewMode !== "desktop" && (
              <div className="h-8 bg-black flex justify-center items-center shrink-0 relative z-20">
                 <div className="w-1/3 h-1.5 bg-gray-700 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
