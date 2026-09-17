"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "@/services/skill.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Skill, CreateSkillDto, SkillCategory } from "@/types/skill";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";

export default function SkillsDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => SkillService.getSkills(),
  });

  const { register, handleSubmit, reset, setValue, watch, control } = useForm<CreateSkillDto>();
  const watchLevel = watch("level");

  const createMutation = useMutation({
    mutationFn: (newSkill: CreateSkillDto) => SkillService.createSkill(newSkill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSkillDto> }) => SkillService.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SkillService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingId(skill.id);
      setValue("name", skill.name);
      setValue("icon", skill.icon);
      setValue("level", skill.level);
      setValue("category", skill.category);
    } else {
      setEditingId(null);
      reset({
        name: "",
        icon: "",
        level: 50,
        category: "FRONTEND" as SkillCategory
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateSkillDto) => {
    // level is string from input, convert to number
    const dataToSubmit = {
      ...formData,
      level: Number(formData.level)
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
          <h2 className="text-2xl font-bold text-black dark:text-white">Skills</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your technical skills</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Skill
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
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Category</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Proficiency</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((skill: Skill) => (
                <tr key={skill.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {skill.icon && <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />}
                      <p className="font-semibold text-black dark:text-white">{skill.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md">
                      {skill.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 max-w-[120px]">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{skill.level}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(skill)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this skill?")) {
                            deleteMutation.mutate(skill.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === skill.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No skills found. Add your first skill!
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
          
          <div className="relative bg-white dark:bg-[#1A1C23] w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {editingId ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="skillForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input {...register("name", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="React" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select {...register("category", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white">
                    <option value="FRONTEND">FRONTEND</option>
                    <option value="BACKEND">BACKEND</option>
                    <option value="TOOLS">TOOLS</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proficiency Level ({watchLevel || 50}%)</label>
                  <input {...register("level", { required: true, min: 1, max: 100 })} type="range" min="1" max="100" className="w-full" />
                </div>

                <div className="space-y-1">
                  <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        label="Skill Icon"
                      />
                    )}
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <button 
                form="skillForm"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Skill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
