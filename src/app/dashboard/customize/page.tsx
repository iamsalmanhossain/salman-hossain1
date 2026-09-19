"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPortfolioService } from "@/services/adminPortfolio.service";
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
  Palette
} from "lucide-react";
import { TemplateRegistry } from "@/templates/TemplateRegistry";
import { AdminPortfolioTemplate } from "@/types/adminPortfolio";
import { WizardAccordion, WizardStep } from "./components/WizardAccordion";
import HeroPage from "../hero/page";
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
  const [formData, setFormData] = useState<Partial<AdminPortfolioTemplate>>({
    templateName: "New Template",
    personalData: { themeStyle: "default", primaryColor: "#0ea5e9" },
    websiteData: { showHero: true, showAbout: true, showProjects: true, showBlog: true }
  });

  const handleRefreshPreview = () => {
    const iframe = document.getElementById("theme-preview-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('REFRESH_DATA', '*');
    }
  };

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ["adminPortfolios"],
    queryFn: () => AdminPortfolioService.getAllTemplates(),
  });

  const templates = templatesData?.data || [];

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateId) {
      const active = templates.find((t) => t.isActive);
      if (active) {
        setSelectedTemplateId(active.id);
        setFormData(active);
      } else {
        setSelectedTemplateId(templates[0].id);
        setFormData(templates[0]);
      }
    }
  }, [templates, selectedTemplateId]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AdminPortfolioService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPortfolios"] });
      toast.success("Template saved successfully!");
      setRefreshCounter(prev => prev + 1);
    },
    onError: () => {
      toast.error("Failed to save template.");
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => AdminPortfolioService.createTemplate(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["adminPortfolios"] });
      setSelectedTemplateId(res.data.id);
      toast.success("New template created!");
      setRefreshCounter(prev => prev + 1);
    },
  });

  const handleSave = () => {
    if (selectedTemplateId && selectedTemplateId !== "new") {
      updateMutation.mutate({ id: selectedTemplateId, data: { ...formData, isActive: true } });
    } else {
      createMutation.mutate({
        templateName: formData.templateName,
        personalData: formData.personalData,
        websiteData: formData.websiteData,
        isActive: true
      });
    }
  };

  const handleSetActive = () => {
    if (selectedTemplateId && selectedTemplateId !== "new") {
      updateMutation.mutate({ id: selectedTemplateId, data: { isActive: true } });
    }
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    if (id === "new") {
      setFormData({
        templateName: "Untitled Template",
        personalData: { themeStyle: "default", primaryColor: "#0ea5e9" },
        websiteData: { showHero: true, showAbout: true, showProjects: true, showBlog: true }
      });
    } else {
      const template = templates.find(t => t.id === id);
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

  // Generate a preview URL with query params
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const previewUrl = selectedTemplateId && selectedTemplateId !== "new"
    ? `${baseUrl}/?previewTemplateId=${selectedTemplateId}`
    : baseUrl;

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">

      {/* Left Sidebar - Theme Settings */}
      <div 
        className={`shrink-0 bg-white dark:bg-[#111] flex flex-col z-20 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-white/10 ${
          isSettingsCollapsed ? "w-0 overflow-hidden border-r-0 opacity-0" : "w-full md:w-[400px] lg:w-[450px] opacity-100"
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] sticky top-0 z-10 shrink-0 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-500" /> Theme Customizer
          </h2>
          {/* Hide button on mobile inside the panel since they might want to toggle from outside */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Design Template</label>
                  <select 
                    value={formData.templateName || "Tech Dark Theme"}
                    onChange={(e) => {
                      const updatedData = { ...formData, templateName: e.target.value, isActive: true };
                      setFormData(updatedData);
                      if (selectedTemplateId && selectedTemplateId !== "new") {
                        updateMutation.mutate({ id: selectedTemplateId, data: updatedData });
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  >
                    {Object.keys(TemplateRegistry).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Section Visibility</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Hero', 'About', 'Skills', 'Experience', 'Education', 'Services', 'Projects', 'Certificates', 'Blog', 'Testimonials', 'Contact'].map((section) => (
                      <label key={section} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-gray-100 dark:border-white/5">
                        <span className="text-xs text-gray-600 dark:text-gray-300">Show {section}</span>
                        <input 
                          type="checkbox" 
                          checked={formData.websiteData?.[`show${section}`] ?? true}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            websiteData: { ...formData.websiteData, [`show${section}`]: e.target.checked } 
                          })}
                          className="w-3.5 h-3.5 rounded text-blue-500 focus:ring-blue-500 bg-gray-100 border-gray-300"
                        />
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

            {/* STEP 3: Skills */}
            <WizardStep 
              id={3} 
              title="Skills" 
              icon={Code} 
              isExpanded={expandedSection === 3} 
              onToggle={() => setExpandedSection(expandedSection === 3 ? 0 : 3)} 
              onNext={() => setExpandedSection(4)}
            >
              <SkillsPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(4);
              }} />
            </WizardStep>
            {/* STEP 4: Experience */}
            <WizardStep id={4} title="Experience" icon={Briefcase} isExpanded={expandedSection === 4} onToggle={() => setExpandedSection(expandedSection === 4 ? 0 : 4)} onNext={() => setExpandedSection(5)}>
              <ExperiencePage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(5);
              }} />
            </WizardStep>
            {/* STEP 5: Education */}
            <WizardStep id={5} title="Education" icon={GraduationCap} isExpanded={expandedSection === 5} onToggle={() => setExpandedSection(expandedSection === 5 ? 0 : 5)} onNext={() => setExpandedSection(6)}>
              <EducationPage hideHeader={true} onNext={() => {
                handleRefreshPreview();
                setExpandedSection(6);
              }} />
            </WizardStep>
            {/* STEP 6: Services */}
            <WizardStep id={6} title="Services" icon={Package} isExpanded={expandedSection === 6} onToggle={() => setExpandedSection(expandedSection === 6 ? 0 : 6)} onNext={() => setExpandedSection(7)}>
              <ServicesPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(7); }} />
            </WizardStep>
            {/* STEP 7: Projects */}
            <WizardStep id={7} title="Projects" icon={FolderGit2} isExpanded={expandedSection === 7} onToggle={() => setExpandedSection(expandedSection === 7 ? 0 : 7)} onNext={() => setExpandedSection(8)}>
              <ProjectsPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(8); }} />
            </WizardStep>
            {/* STEP 8: Certificates */}
            <WizardStep id={8} title="Certificates" icon={Award} isExpanded={expandedSection === 8} onToggle={() => setExpandedSection(expandedSection === 8 ? 0 : 8)} onNext={() => setExpandedSection(9)}>
              <CertificatesPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(9); }} />
            </WizardStep>
            {/* STEP 9: Testimonials */}
            <WizardStep id={9} title="Testimonials" icon={MessageSquare} isExpanded={expandedSection === 9} onToggle={() => setExpandedSection(expandedSection === 9 ? 0 : 9)} onNext={() => setExpandedSection(10)}>
              <TestimonialsPage hideHeader={true} onNext={() => { handleRefreshPreview(); setExpandedSection(10); }} />
            </WizardStep>
            {/* STEP 10: Social Links */}
            <WizardStep id={10} title="Social Links" icon={LinkIcon} isExpanded={expandedSection === 10} onToggle={() => setExpandedSection(expandedSection === 10 ? 0 : 10)} onNext={() => {
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

      {/* Right Content - Preview Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100 dark:bg-[#050505] relative shadow-inner">

        {/* Preview Topbar */}
        <div className="h-14 bg-white dark:bg-[#1A1C23] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          
          {/* Left Side: Toggle Sidebar Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
              className="p-2 rounded-xl transition-all text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2"
              title="Toggle Sidebar"
            >
              {isSettingsCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              <span className="text-sm font-medium hidden sm:block">{isSettingsCollapsed ? 'Open Editor' : 'Hide Editor'}</span>
            </button>
          </div>

          {/* Center: Device Previews */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setPreviewMode("desktop")}
            className={`p-2 rounded-xl transition-all ${previewMode === "desktop" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
            title="Desktop Preview"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPreviewMode("tablet")}
            className={`p-2 rounded-xl transition-all ${previewMode === "tablet" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
            title="Tablet Preview"
          >
            <Tablet className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`p-2 rounded-xl transition-all ${previewMode === "mobile" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"}`}
            title="Mobile Preview"
          >
            <Smartphone className="w-5 h-5" />
          </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-8 custom-scrollbar relative">
          {/* Subtle dotted background pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div 
            className={`bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-500 ease-in-out border border-gray-300 dark:border-gray-700 relative z-10`}
            style={{
              width: previewMode === "desktop" ? "100%" : previewMode === "tablet" ? "768px" : "375px",
              height: "100%",
              maxWidth: previewMode === "desktop" ? "1400px" : "100%"
            }}
          >
            {/* We add a key to force re-render when template changes or refreshCounter updates */}
            <iframe
              id="theme-preview-iframe"
              key={`${previewUrl}-${refreshCounter}`}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Theme Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
