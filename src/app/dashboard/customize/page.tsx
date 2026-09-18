"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPortfolioService } from "@/services/adminPortfolio.service";
import { Loader2, Monitor, Tablet, Smartphone, CheckCircle, Save, Plus, Trash2 } from "lucide-react";
import { AdminPortfolioTemplate } from "@/types/adminPortfolio";
import { toast } from "sonner";

export default function CustomizeThemePage() {
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AdminPortfolioTemplate>>({
    templateName: "New Template",
    personalData: { themeStyle: "default", primaryColor: "#0ea5e9" },
    websiteData: { showHero: true, showAbout: true, showProjects: true, showBlog: true }
  });

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
    },
  });

  const handleSave = () => {
    if (selectedTemplateId && selectedTemplateId !== "new") {
      updateMutation.mutate({ id: selectedTemplateId, data: formData });
    } else {
      createMutation.mutate({
        templateName: formData.templateName,
        personalData: formData.personalData,
        websiteData: formData.websiteData,
        isActive: false
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
    <div className="flex flex-col lg:flex-row flex-1 h-full w-full overflow-hidden">
      
      {/* Left Sidebar - Editor */}
      <div className="w-full lg:w-96 bg-white dark:bg-[#1A1C23] border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0 overflow-hidden shadow-xl z-10">
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#1A1C23]">
          <h2 className="font-bold text-lg text-black dark:text-white">Theme Customizer</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Template</label>
            <select 
              value={selectedTemplateId || ""}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.templateName} {t.isActive ? "(Active)" : ""}
                </option>
              ))}
              <option value="new">+ Create New Template</option>
            </select>
          </div>

          <hr className="border-gray-200 dark:border-white/5" />

          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">General Settings</h3>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Template Name</label>
              <input 
                type="text" 
                value={formData.templateName || ""}
                onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500">Theme Style</label>
              <select 
                value={formData.personalData?.themeStyle || "default"}
                onChange={(e) => setFormData({ ...formData, personalData: { ...formData.personalData, themeStyle: e.target.value } })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="default">Default</option>
                <option value="minimal">Minimal</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-white/5" />

          {/* Section Visibility */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Visibility</h3>
            
            {['Hero', 'About', 'Projects', 'Blog'].map((section) => (
              <label key={section} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">Show {section}</span>
                <input 
                  type="checkbox" 
                  checked={formData.websiteData?.[`show${section}`] ?? true}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    websiteData: { ...formData.websiteData, [`show${section}`]: e.target.checked } 
                  })}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-gray-100 border-gray-300"
                />
              </label>
            ))}
          </div>

        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1C23] flex flex-col gap-3 shrink-0">
          <button 
            onClick={handleSave}
            disabled={updateMutation.isPending || createMutation.isPending}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {(updateMutation.isPending || createMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          
          {selectedTemplateId !== "new" && (
            <button 
              onClick={handleSetActive}
              disabled={formData.isActive || updateMutation.isPending}
              className={`w-full py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                formData.isActive 
                  ? 'bg-green-500/10 text-green-500 cursor-not-allowed' 
                  : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {formData.isActive ? "Currently Active" : "Set as Active Theme"}
            </button>
          )}
        </div>
      </div>

      {/* Right Content - Preview Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100 dark:bg-[#050505] relative shadow-inner">
        
        {/* Preview Topbar */}
        <div className="h-14 bg-white dark:bg-[#1A1C23] border-b border-gray-200 dark:border-white/10 flex items-center justify-center gap-4 shrink-0 shadow-sm z-10">
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
            {/* We add a key to force re-render when template changes, so the iframe reloads with new params */}
            <iframe 
              key={previewUrl}
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
