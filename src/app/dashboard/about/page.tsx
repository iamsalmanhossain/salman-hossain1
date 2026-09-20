"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAboutSections, createAboutSection, updateAboutSection } from "@/services/about.service";
import { Loader2, Save } from "lucide-react";
import { IAbout, ICreateAbout } from "@/types/about";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

export default function AboutDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["aboutSections"],
    queryFn: () => getAboutSections(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<ICreateAbout>();
  const aboutData = data?.data && data.data.length > 0 ? data.data[0] : null;

  useEffect(() => {
    if (aboutData) {
      setValue("name", aboutData.name);
      setValue("headline", aboutData.headline);
      setValue("shortBio", aboutData.shortBio);
      setValue("description", aboutData.description);
      setValue("profileImage", aboutData.profileImage);
      setValue("resumeUrl", aboutData.resumeUrl);
      setValue("location", aboutData.location);
      setValue("email", aboutData.email);
      setValue("availability", aboutData.availability);
      setValue("experienceYears", aboutData.experienceYears);
      setValue("projectsCount", aboutData.projectsCount);
      setValue("clientsCount", aboutData.clientsCount);
    }
  }, [aboutData, setValue]);

  const updateMutation = useMutation({
    mutationFn: (formData: ICreateAbout) => {
      if (aboutData?.id) {
        return updateAboutSection(aboutData.id, formData);
      } else {
        return createAboutSection(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutSections"] });
      toast.success("About section saved successfully!");
      if (onNext) onNext();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save About section");
    }
  });

  const onSubmit = (formData: ICreateAbout) => {
    const payload = {
      ...formData,
      experienceYears: Number(formData.experienceYears) || 0,
      projectsCount: Number(formData.projectsCount) || 0,
      clientsCount: Number(formData.clientsCount) || 0,
    };
    updateMutation.mutate(payload as ICreateAbout);
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
          <h2 className="text-2xl font-bold text-black dark:text-white">About Me</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your personal information and bio</p>
        </div>
      )}

      <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 md:p-8 shadow-sm'}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input 
                {...register("name", { required: true })} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Headline</label>
              <input 
                {...register("headline", { required: true })} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
                placeholder="E.g., Senior Software Engineer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Bio</label>
            <textarea 
              {...register("shortBio", { required: true })} 
              rows={3} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="A brief introduction about yourself..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Description</label>
            <textarea 
              {...register("description", { required: true })} 
              rows={6} 
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="Detailed background and information..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
              <input 
                type="number"
                {...register("experienceYears", { required: true })} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Projects Count</label>
              <input 
                type="number"
                {...register("projectsCount", { required: true })} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Clients Count</label>
              <input 
                type="number"
                {...register("clientsCount", { required: true })} 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email"
                {...register("email")} 
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
          
          <div className="flex items-center gap-3">
            <input 
              type="checkbox"
              id="availability"
              {...register("availability")} 
              className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500" 
            />
            <label htmlFor="availability" className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for Freelance / Hire</label>
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
              {hideHeader ? "Save & Next" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
