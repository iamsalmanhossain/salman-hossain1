"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EducationService } from "@/services/education.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Education, CreateEducationDto } from "@/types/education";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EducationDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      toast.success("Education added successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to add education")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEducationDto> }) => EducationService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education updated successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to update education")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => EducationService.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education deleted successfully!");
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to delete education")
  });

  const openForm = (education?: Education) => {
    if (education) {
      setEditingId(education.id);
      setValue("degree", education.degree);
      setValue("institute", education.institute);
      setValue("field", education.field);
      setValue("startYear", education.startYear);
      if (education.endYear) {
        setValue("endYear", education.endYear);
      }
    } else {
      setEditingId(null);
      reset({
        degree: "",
        institute: "",
        field: "",
        startYear: new Date().getFullYear(),
        endYear: undefined,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateEducationDto) => {
    const dataToSubmit = {
      ...formData,
      startYear: Number(formData.startYear),
      endYear: formData.endYear ? Number(formData.endYear) : undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  return (
    <div className={`space-y-6 mx-auto ${hideHeader ? 'max-w-full' : 'max-w-6xl'}`}>
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Education</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your educational background</p>
          </div>
        </div>
      )}

      {isFormOpen ? (
        <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 shadow-sm'}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "Edit Education" : "Add New Education"}
            </h3>
          </div>
          <form id="educationForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
              <input {...register("degree", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., Bachelor of Science" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
              <input {...register("field", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., Computer Science" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
              <input {...register("institute", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., MIT" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Year</label>
                <input {...register("startYear", { required: true, valueAsNumber: true })} type="number" min="1900" max={new Date().getFullYear() + 10} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" placeholder="2018" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Year (Leave blank if present)</label>
                <input {...register("endYear", { valueAsNumber: true })} type="number" min="1900" max={new Date().getFullYear() + 10} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" placeholder="2022" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10 mt-6">
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2">
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Save Education"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button onClick={() => openForm()} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm">
              <Plus className="w-5 h-5" /> Add Education
            </button>
          </div>
          
          <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
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
                        <p className="text-sm text-gray-500">{education.field}</p>
                      </td>
                      <td className="p-4"><p className="font-medium text-gray-700 dark:text-gray-300">{education.institute}</p></td>
                      <td className="p-4"><span className="text-sm text-gray-600 dark:text-gray-400">{education.startYear} - {education.endYear ? education.endYear : 'Present'}</span></td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(education)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(education.id); }} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            {deleteMutation.isPending && deleteMutation.variables === education.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No education records found. Add your first entry!</td></tr>
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
