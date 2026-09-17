"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EducationService } from "@/services/education.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Education, CreateEducationDto } from "@/types/education";
import { useForm } from "react-hook-form";

export default function EducationDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["education"],
    queryFn: () => EducationService.getEducations(),
  });

  const { register, handleSubmit, reset, setValue } = useForm<CreateEducationDto>();

  const createMutation = useMutation({
    mutationFn: (newEducation: CreateEducationDto) => EducationService.createEducation(newEducation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEducationDto> }) => EducationService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => EducationService.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
  });

  const openModal = (education?: Education) => {
    if (education) {
      setEditingId(education.id);
      setValue("degree", education.degree);
      setValue("institution", education.institution);
      setValue("fieldOfStudy", education.fieldOfStudy);
      setValue("startDate", new Date(education.startDate).toISOString().split('T')[0]);
      if (education.endDate) {
        setValue("endDate", new Date(education.endDate).toISOString().split('T')[0]);
      }
      setValue("description", education.description);
    } else {
      setEditingId(null);
      reset({
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateEducationDto) => {
    // If endDate is empty string, make it undefined
    const dataToSubmit = {
      ...formData,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      startDate: new Date(formData.startDate).toISOString()
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
          <h2 className="text-2xl font-bold text-black dark:text-white">Education</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your educational background</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Education
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
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Degree & Field</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Institution</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Timeline</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((education: Education) => (
                <tr key={education.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-black dark:text-white">{education.degree}</p>
                    <p className="text-sm text-gray-500">{education.fieldOfStudy}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{education.institution}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(education.startDate).getFullYear()} - {education.endDate ? new Date(education.endDate).getFullYear() : 'Present'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(education)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this education entry?")) {
                            deleteMutation.mutate(education.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === education.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No education records found. Add your first entry!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white dark:bg-[#1A1C23] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {editingId ? "Edit Education" : "Add New Education"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="educationForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                  <input {...register("degree", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., Bachelor of Science" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                  <input {...register("fieldOfStudy", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., Computer Science" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                  <input {...register("institution", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., MIT" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input {...register("startDate", { required: true })} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date (Leave blank if present)</label>
                    <input {...register("endDate")} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
                  <textarea {...register("description")} rows={3} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Describe your achievements..." />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <button 
                form="educationForm"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Save Education"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
