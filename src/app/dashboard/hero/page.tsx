"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HeroSectionService } from "@/services/heroSection.service";
import { Loader2, Save } from "lucide-react";
import { CreateHeroSectionDto } from "@/types/heroSection";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

export default function HeroDashboard() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: () => HeroSectionService.getHeroSection(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateHeroSectionDto>();
  const heroData = data?.data;

  useEffect(() => {
    if (heroData) {
      setValue("heroTitle", heroData.heroTitle);
      setValue("designations", (heroData.designations || []).join(', ') as any);
      setValue("heroDescription", heroData.heroDescription);
      setValue("resumeUrl", heroData.resumeUrl);
      setValue("profileImage", heroData.profileImage);
      setValue("about", heroData.about);
      setValue("experienceYears", heroData.experienceYears);
      setValue("totalProjects", heroData.totalProjects);
      setValue("totalToolsAndTech", heroData.totalToolsAndTech);
      setValue("email", heroData.email);
      setValue("phone", heroData.phone);
      setValue("location", heroData.location);
      setValue("isActive", heroData.isActive);
    }
  }, [heroData, setValue]);

  const updateMutation = useMutation({
    mutationFn: (formData: CreateHeroSectionDto) => {
      if (heroData?.id) {
        return HeroSectionService.updateHeroSection(heroData.id, formData);
      } else {
        return HeroSectionService.createHeroSection(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section saved successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save Hero section");
    }
  });

  const onSubmit = (formData: CreateHeroSectionDto) => {
    const payload = {
      ...formData,
      designations: (formData.designations as unknown as string).split(',').map(s => s.trim()).filter(Boolean),
      experienceYears: Number(formData.experienceYears) || 0,
      totalProjects: Number(formData.totalProjects) || 0,
      totalToolsAndTech: Number(formData.totalToolsAndTech) || 0,
    };
    updateMutation.mutate(payload as CreateHeroSectionDto);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white">Hero Section</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage the main content of your home page</p>
      </div>

      <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input 
                {...register("heroTitle", { required: true })} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., Abass Alzouma"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designations (Comma separated)</label>
              <input 
                {...register("designations")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., Full Stack Developer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea 
              {...register("heroDescription", { required: true })} 
              rows={4} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="Passionate web and mobile developer..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">About (Rich Text)</label>
            <textarea 
              {...register("about")} 
              rows={6} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="Write about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
              <input 
                type="number"
                {...register("experienceYears")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Projects</label>
              <input 
                type="number"
                {...register("totalProjects")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Tools & Tech</label>
              <input 
                type="number"
                {...register("totalToolsAndTech")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email"
                {...register("email")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <input 
                {...register("phone")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input 
                {...register("location")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., Dhaka, Bangladesh"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Controller
                name="resumeUrl"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="application/pdf"
                    label="Resume PDF URL"
                    isPdf={true}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Controller
                name="profileImage"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    label="Profile Image URL"
                  />
                )}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-200 dark:border-white/10">
            <button 
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {heroData ? "Save Changes" : "Create Hero"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
