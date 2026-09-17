"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogService } from "@/services/blog.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Blog, CreateBlogDto } from "@/types/blog";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";

export default function BlogsDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlogDto> }) => BlogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => BlogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const openModal = (blog?: Blog) => {
    if (blog) {
      setEditingId(blog.id);
      setValue("title", blog.title);
      setValue("content", blog.content);
      setValue("thumbnail", blog.thumbnail);
      setValue("published", blog.published);
    } else {
      setEditingId(null);
      reset({
        title: "",
        content: "",
        thumbnail: "",
        published: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Blogs</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your blog posts</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Write Post
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
                      {blog.thumbnail && <img src={blog.thumbnail} alt={blog.title} className="w-12 h-12 object-cover rounded-md" />}
                      <p className="font-semibold text-black dark:text-white line-clamp-2">{blog.title}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{blog.slug}</p>
                  </td>
                  <td className="p-4 text-center">
                    {blog.published ? (
                      <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md">Published</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-gray-500/10 text-gray-500 rounded-md">Draft</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(blog)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this blog post?")) {
                            deleteMutation.mutate(blog.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
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
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white dark:bg-[#1A1C23] w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {editingId ? "Edit Blog" : "Write New Blog"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="blogForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input {...register("title", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., How to build a full stack app..." />
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
                        label="Thumbnail Image URL (optional)"
                      />
                    )}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                  <textarea {...register("content", { required: true })} rows={12} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm" placeholder="# Heading 1&#10;Write your post here..." />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input {...register("published")} type="checkbox" id="published" className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500" />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish this post</label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors font-medium">
                Cancel
              </button>
              <button 
                form="blogForm"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
