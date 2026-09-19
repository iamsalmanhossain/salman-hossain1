"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blog.service";
import { Loader2, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Blog, CreateBlogDto } from "@/types/blog";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

export default function BlogsDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => BlogService.getBlogs(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateBlogDto>();

  const createMutation = useMutation({
    mutationFn: (newBlog: CreateBlogDto) => BlogService.createBlog(newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog created successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to create blog")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlogDto> }) => BlogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog updated successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to update blog")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => BlogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog deleted successfully!");
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to delete blog")
  });

  const openForm = (blog?: Blog) => {
    if (blog) {
      setEditingId(blog.id);
      setValue("title", blog.title);
      setValue("slug", blog.slug);
      setValue("summary", blog.summary || "");
      setValue("content", blog.content);
      setValue("thumbnail", blog.thumbnail || "");
      setValue("isPublished", blog.isPublished);
    } else {
      setEditingId(null);
      reset({
        title: "",
        slug: "",
        summary: "",
        content: "",
        thumbnail: "",
        isPublished: false,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateBlogDto) => {
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
            <h2 className="text-2xl font-bold text-black dark:text-white">Blogs</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your blog posts</p>
          </div>
        </div>
      )}

      {isFormOpen ? (
        <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 shadow-sm'}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "Edit Blog Post" : "Write New Post"}
            </h3>
          </div>
          <form id="blogForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input {...register("title", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., How to build a full stack app..." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                <input {...register("slug", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., how-to-build-a-full-stack-app" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary (Optional)</label>
              <input {...register("summary")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Brief summary of the post..." />
            </div>

            <div className="space-y-1">
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    label="Thumbnail Image (Optional)"
                  />
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
              <textarea 
                {...register("content", { required: true })} 
                rows={12} 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm" 
                placeholder="# Heading 1&#10;Write your post here..." 
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input {...register("isPublished")} type="checkbox" id="isPublished" className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500" />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish this post (make it visible to everyone)</label>
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
                {editingId ? "Save Changes" : "Create Post"}
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
              <Plus className="w-5 h-5" /> Write Post
            </button>
          </div>
          <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Title & Thumbnail</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Slug</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-center">Status</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((blog: Blog) => (
                    <tr key={blog.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {blog.thumbnail && (
                            <img
                              src={blog.thumbnail}
                              alt={blog.title}
                              className="w-12 h-12 object-cover rounded-md border border-gray-200 dark:border-white/10"
                            />
                          )}
                          <p className="font-semibold text-black dark:text-white line-clamp-2">{blog.title}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md text-gray-500">
                          {blog.slug}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {blog.isPublished ? (
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-md font-medium border border-green-500/20">
                            Published
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-md font-medium border border-yellow-500/20">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(blog)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(blog.id); }} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            {deleteMutation.isPending && deleteMutation.variables === blog.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        No blogs found. Start writing!
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
