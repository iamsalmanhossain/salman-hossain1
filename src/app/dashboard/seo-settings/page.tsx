"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeoSettingService } from "@/services/seoSetting.service";
import { Loader2, Save } from "lucide-react";
import { CreateSeoSettingDto } from "@/types/seoSetting";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";

export default function SeoSettingsDashboard() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seoSetting"],
    queryFn: () => SeoSettingService.getSeoSetting(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateSeoSettingDto>();
  const seoData = data?.data;

  useEffect(() => {
    if (seoData) {
      setValue("title", seoData.title);
      setValue("description", seoData.description);
      setValue("keywords", seoData.keywords);
      setValue("ogImage", seoData.ogImage);
    }
  }, [seoData, setValue]);

  const updateMutation = useMutation({
    mutationFn: (formData: CreateSeoSettingDto) => {
      if (seoData?.id) {
        return SeoSettingService.updateSeoSetting(seoData.id, formData);
      } else {
        return SeoSettingService.createSeoSetting(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seoSetting"] });
      alert("SEO Settings updated successfully!");
    },
  });

  const onSubmit = (formData: CreateSeoSettingDto) => {
    updateMutation.mutate(formData);
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
        <h2 className="text-2xl font-bold text-black dark:text-white">SEO Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage global meta tags and SEO configurations for your portfolio</p>
      </div>

      <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Global Title</label>
            <input 
              {...register("title", { required: true })} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              placeholder="E.g., Abass Alzouma | Full Stack Developer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Global Meta Description</label>
            <textarea 
              {...register("description", { required: true })} 
              rows={3} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="A brief description of your portfolio for search engines..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Keywords</label>
            <textarea 
              {...register("keywords", { required: true })} 
              rows={2} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="react, nextjs, full stack developer, portfolio..."
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="ogImage"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  accept="image/*"
                  label="Open Graph Image URL (OG Image)"
                />
              )}
            />
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
              {seoData ? "Save Settings" : "Create Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
