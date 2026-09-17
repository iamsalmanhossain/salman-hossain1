"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExperienceService } from "@/services/experience.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Experience, CreateExperienceDto } from "@/types/experience";
import { useForm } from "react-hook-form";

export default function ExperienceDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: () => ExperienceService.getExperiences(),
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateExperienceDto>();
  const isCurrentWatch = watch("isCurrent");

  const createMutation = useMutation({
    mutationFn: (newExp: CreateExperienceDto) => ExperienceService.createExperience(newExp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExperienceDto> }) => ExperienceService.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ExperienceService.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingId(exp.id);
      setValue("company", exp.company);
      setValue("position", exp.position);
      setValue("description", exp.description);
      setValue("startDate", new Date(exp.startDate).toISOString().split('T')[0]);
      if (exp.endDate) {
        setValue("endDate", new Date(exp.endDate).toISOString().split('T')[0]);
      }
      setValue("isCurrent", exp.isCurrent);
    } else {
      setEditingId(null);
      reset({
        company: "",
        position: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        isCurrent: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateExperienceDto) => {
    const dataToSubmit = {
      ...formData,
      endDate: formData.isCurrent ? undefined : formData.endDate
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Experience</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your work history</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Position</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Company</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Timeline</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((exp: Experience) => (
                <tr key={exp.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-black dark:text-white">{exp.position}</p>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {exp.company}
                  </td>
                  <td className="p-4">
                    <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md text-gray-600 dark:text-gray-300">
                      {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(exp)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this experience?")) {
                            deleteMutation.mutate(exp.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No experience found. Add your first experience!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white dark:bg-[#1A1C23] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {editingId ? "Edit Experience" : "Add New Experience"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                <Trash2 className="w-5 h-5 hidden" /> 
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="expForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                    <input {...register("company", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                    <input {...register("position", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea {...register("description", { required: true })} rows={4} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input {...register("startDate", { required: true })} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" />
                  </div>
                  {!isCurrentWatch && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                      <input {...register("endDate")} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input {...register("isCurrent")} type="checkbox" id="isCurrent" className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500" />
                  <label htmlFor="isCurrent" className="text-sm font-medium text-gray-700 dark:text-gray-300">I currently work here</label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <button 
                form="expForm"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
