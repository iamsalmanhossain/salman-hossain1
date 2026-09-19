"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { ProjectCategoryService } from "@/services/projectCategory.service";
import { Loader2, Plus, Edit2, Trash2, ExternalLink, Code } from "lucide-react";
import { Project, CreateProjectDto } from "@/types/project";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProjectsDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => ProjectService.getProjects(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["project-categories"],
    queryFn: () => ProjectCategoryService.getCategories(),
  });

  const { register, handleSubmit, reset, setValue } = useForm<CreateProjectDto>();

  const createMutation = useMutation({
    mutationFn: (newProject: CreateProjectDto) => ProjectService.createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to create project")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProjectDto> }) => ProjectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to update project")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to delete project")
  });

  const openForm = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setValue("title", project.title);
      setValue("description", project.description);
      setValue("content", project.content);
      setValue("githubFrontendUrl", project.githubFrontendUrl);
      setValue("githubBackendUrl", project.githubBackendUrl);
      setValue("liveUrl", project.liveUrl);
      setValue("videoUrl", project.videoUrl);
      setValue("technologies", project.technologies?.join(', ') as any);
      setValue("features", project.features?.join(', ') as any);
      setValue("thumbnails", project.thumbnails?.join(', ') as any);
      setValue("tags", project.tags?.join(', ') as any);
      setValue("role", project.role);
      setValue("startDate", project.startDate ? project.startDate.split('T')[0] : "");
      setValue("endDate", project.endDate ? project.endDate.split('T')[0] : "");
      setValue("status", project.status);
      setValue("categoryId", project.categoryId);
      setValue("featured", project.featured);
    } else {
      setEditingId(null);
      reset({
        title: "",
        description: "",
        content: "",
        githubFrontendUrl: "",
        githubBackendUrl: "",
        liveUrl: "",
        videoUrl: "",
        technologies: [],
        features: [],
        thumbnails: [],
        tags: [],
        role: "",
        status: "DRAFT" as any,
        featured: false
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateProjectDto) => {
    const dataToSubmit = {
      ...formData,
      technologies: typeof formData.technologies === 'string' 
        ? (formData.technologies as string).split(',').map(t => t.trim()).filter(Boolean)
        : formData.technologies,
      features: typeof formData.features === 'string'
        ? (formData.features as string).split(',').map(t => t.trim()).filter(Boolean)
        : formData.features,
      thumbnails: typeof formData.thumbnails === 'string'
        ? (formData.thumbnails as string).split(',').map(t => t.trim()).filter(Boolean)
        : formData.thumbnails,
      tags: typeof formData.tags === 'string'
        ? (formData.tags as string).split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags,
    };

    if (dataToSubmit.startDate) {
      dataToSubmit.startDate = new Date(dataToSubmit.startDate).toISOString();
    } else {
      delete dataToSubmit.startDate;
    }
    if (dataToSubmit.endDate) {
      dataToSubmit.endDate = new Date(dataToSubmit.endDate).toISOString();
    } else {
      delete dataToSubmit.endDate;
    }

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
            <h2 className="text-2xl font-bold text-black dark:text-white">Projects</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your portfolio projects</p>
          </div>
        </div>
      )}

      {isFormOpen ? (
        <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 shadow-sm'}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "Edit Project" : "Add New Project"}
            </h3>
          </div>
          <form id="projectForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input {...register("title", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Technologies (comma separated)</label>
                <input {...register("technologies")} placeholder="React, Next.js, Tailwind" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Description</label>
              <textarea {...register("description", { required: true })} rows={2} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Content (Markdown/HTML)</label>
              <textarea {...register("content")} rows={5} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub Frontend URL</label>
                <input {...register("githubFrontendUrl")} type="url" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub Backend URL</label>
                <input {...register("githubBackendUrl")} type="url" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Live URL</label>
                <input {...register("liveUrl")} type="url" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
                <input {...register("videoUrl")} type="url" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Features (comma separated)</label>
              <textarea {...register("features")} rows={2} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
              <input {...register("tags")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnails (URLs, comma separated)</label>
              <input {...register("thumbnails")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <input {...register("role")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select {...register("status")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                <input {...register("startDate")} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                <input {...register("endDate")} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select {...register("categoryId")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500">
                  <option value="">Select Category</option>
                  {categoriesData?.data?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input {...register("featured")} type="checkbox" id="featured" className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Feature this project on home page</label>
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
                {editingId ? "Save Changes" : "Create Project"}
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
              <Plus className="w-5 h-5" /> Add Project
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Project</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Tech Stack</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-center">Featured</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((project: Project) => (
                    <tr key={project.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-black dark:text-white">{project.title}</p>
                        <div className="flex gap-3 mt-1">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> Live
                            </a>
                          )}
                          {project.githubFrontendUrl && (
                            <a href={project.githubFrontendUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-500 dark:text-gray-400 hover:underline flex items-center gap-1">
                              <Code className="w-3 h-3" /> GitHub
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md text-gray-600 dark:text-gray-300">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md text-gray-600 dark:text-gray-300">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {project.featured && (
                          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(project)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(project.id); }} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            {deleteMutation.isPending && deleteMutation.variables === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        No projects found. Add your first project!
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
