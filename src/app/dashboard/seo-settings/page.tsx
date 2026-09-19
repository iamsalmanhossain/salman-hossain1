"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeoSettingService } from "@/services/seoSetting.service";
import { Loader2, Save } from "lucide-react";
import { CreateSeoSettingDto } from "@/types/seoSetting";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

export default function SeoSettingsDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seoSetting"],
    queryFn: () => SeoSettingService.getSeoSetting(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateSeoSettingDto>();
  const seoData = data?.data;

  useEffect(() => {
    if (seoData) {
      setValue("siteName", seoData.siteName);
      setValue("metaTitle", seoData.metaTitle);
      setValue("metaDescription", seoData.metaDescription);
      setValue("metaKeywords", (seoData.metaKeywords || []).join(', ') as any);
      setValue("author", seoData.author);
      setValue("favicon", seoData.favicon);
      setValue("ogTitle", seoData.ogTitle);
      setValue("ogDescription", seoData.ogDescription);
      setValue("ogImage", seoData.ogImage);
      setValue("twitterCard", seoData.twitterCard);
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
      toast.success("SEO Settings updated successfully!");
      if (onNext) onNext();
    },
  });

  const onSubmit = (formData: CreateSeoSettingDto) => {
    const payload = {
      ...formData,
      metaKeywords: (formData.metaKeywords as unknown as string).split(',').map(s => s.trim()).filter(Boolean)
    };
    updateMutation.mutate(payload as CreateSeoSettingDto);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 mx-auto ${hideHeader ? 'max-w-full' : 'max-w-4xl'}`}>
      {!hideHeader && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">SEO Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage global meta tags and SEO configurations for your portfolio</p>
        </div>
      )}

      <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 md:p-8 shadow-sm'}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
              <input 
                {...register("siteName")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., Abass Portfolio"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
              <input 
                {...register("author")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., Abass Alzouma"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Global Title</label>
            <input 
              {...register("metaTitle", { required: true })} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              placeholder="E.g., Abass Alzouma | Full Stack Developer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Global Meta Description</label>
            <textarea 
              {...register("metaDescription", { required: true })} 
              rows={3} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="A brief description of your portfolio for search engines..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Keywords (Comma separated)</label>
            <textarea 
              {...register("metaKeywords", { required: true })} 
              rows={2} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="react, nextjs, full stack developer, portfolio..."
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-medium text-black dark:text-white">Open Graph (Social Media)</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Settings for how your site appears when shared on social platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">OG Title</label>
              <input 
                {...register("ogTitle")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Twitter Card Type</label>
              <input 
                {...register("twitterCard")} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="summary_large_image"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">OG Description</label>
            <textarea 
              {...register("ogDescription")} 
              rows={2} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Controller
                name="ogImage"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    label="OG Image URL"
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Controller
                name="favicon"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    label="Favicon URL"
                  />
                )}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-white/10">
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
              {hideHeader ? "Save & Next" : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
