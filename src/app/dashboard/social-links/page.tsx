"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SocialLinksService } from "@/services/socialLinks.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { SocialLink, CreateSocialLinkDto } from "@/types/socialLinks";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

export default function SocialLinksDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: () => SocialLinksService.getSocialLinks(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateSocialLinkDto>();

  const createMutation = useMutation({
    mutationFn: (newLink: CreateSocialLinkDto) => SocialLinksService.createSocialLink(newLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Social link created successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to create social link")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSocialLinkDto> }) => SocialLinksService.updateSocialLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Social link updated successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to update social link")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SocialLinksService.deleteSocialLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Social link deleted successfully!");
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to delete social link")
  });

  const openForm = (link?: SocialLink) => {
    if (link) {
      setEditingId(link.id);
      setValue("platform", link.platform);
      setValue("url", link.url);
      setValue("iconUrl", link.iconUrl);
      setValue("heroSectionId", link.heroSectionId);
    } else {
      setEditingId(null);
      reset({
        platform: "",
        url: "",
        iconUrl: "",
        heroSectionId: "",
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateSocialLinkDto) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className={`space-y-6 mx-auto ${hideHeader ? 'max-w-full' : 'max-w-6xl'}`}>
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Social Links</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your social media profiles</p>
          </div>
        </div>
      )}

      {isFormOpen ? (
        <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 shadow-sm'}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "Edit Social Link" : "Add New Social Link"}
            </h3>
          </div>
          <form id="socialForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
              <input {...register("platform", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., github, linkedin, twitter" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile URL</label>
              <input {...register("url", { required: true })} type="url" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="https://..." />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hero Section ID</label>
              <input {...register("heroSectionId", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Enter Hero Section ID" />
            </div>

            <div className="space-y-1">
              <Controller
                name="iconUrl"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    label="Icon Image (optional)"
                  />
                )}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10 mt-6">
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Link"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button 
              onClick={() => openForm()}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add Link
            </button>
          </div>
          <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Platform</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">URL</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((link: SocialLink) => (
                    <tr key={link.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-black dark:text-white capitalize">{link.platform}</p>
                      </td>
                      <td className="p-4">
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                          {link.url}
                        </a>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(link)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(link.id); }} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            {deleteMutation.isPending && deleteMutation.variables === link.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">
                        No social links found. Add your profiles!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
