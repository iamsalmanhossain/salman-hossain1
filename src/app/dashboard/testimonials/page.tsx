"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TestimonialService } from "@/services/testimonial.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Testimonial, CreateTestimonialDto } from "@/types/testimonial";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";

export default function TestimonialsDashboard({ hideHeader, onNext }: { hideHeader?: boolean, onNext?: () => void }) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => TestimonialService.getTestimonials(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateTestimonialDto>();

  const createMutation = useMutation({
    mutationFn: (newTestimonial: CreateTestimonialDto) => TestimonialService.createTestimonial(newTestimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial created successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to create testimonial")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTestimonialDto> }) => TestimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial updated successfully!");
      closeForm();
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to update testimonial")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TestimonialService.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted successfully!");
      if (onNext) onNext();
    },
    onError: () => toast.error("Failed to delete testimonial")
  });

  const openForm = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setValue("name", testimonial.name);
      setValue("designation", testimonial.designation);
      setValue("review", testimonial.review);
      setValue("image", testimonial.image);
    } else {
      setEditingId(null);
      reset({
        name: "",
        designation: "",
        review: "",
        image: "",
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateTestimonialDto) => {
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
            <h2 className="text-2xl font-bold text-black dark:text-white">Testimonials</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage feedback from your clients</p>
          </div>
        </div>
      )}

      {isFormOpen ? (
        <div className={`bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl ${hideHeader ? 'p-0 border-0 shadow-none' : 'p-6 shadow-sm'}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>
          </div>
          <form id="testimonialForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
              <input {...register("name", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., John Doe" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designation / Company</label>
              <input {...register("designation")} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., CEO at Company" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea {...register("review", { required: true })} rows={4} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="What did they say about you?" />
            </div>

            <div className="space-y-1">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    accept="image/*"
                    label="Avatar Image (optional)"
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
                {editingId ? "Save Changes" : "Create Testimonial"}
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
              <Plus className="w-5 h-5" /> Add Testimonial
            </button>
          </div>
          <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Client</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Message</th>
                    <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((testimonial: Testimonial) => (
                    <tr key={testimonial.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {testimonial.image ? (
                            <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 object-cover rounded-full" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 text-lg font-bold">
                              {testimonial.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-black dark:text-white">{testimonial.name}</p>
                            <p className="text-xs text-gray-500">{testimonial.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md italic">
                          "{testimonial.review}"
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(testimonial)} className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(testimonial.id); }} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            {deleteMutation.isPending && deleteMutation.variables === testimonial.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || data.data.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">
                        No testimonials found. Add your first client review!
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
