"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServicesService } from "@/services/service.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Service, CreateServiceDto } from "@/types/service";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";

export default function ServicesDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => ServicesService.getServices(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateServiceDto>();

  const createMutation = useMutation({
    mutationFn: (newService: CreateServiceDto) => ServicesService.createService(newService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateServiceDto> }) => ServicesService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ServicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const openModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setValue("title", service.title);
      setValue("description", service.description);
      setValue("icon", service.icon);
    } else {
      setEditingId(null);
      reset({
        title: "",
        description: "",
        icon: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateServiceDto) => {
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
          <h2 className="text-2xl font-bold text-black dark:text-white">Services</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage what you offer to clients</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Service
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
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Service</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Description</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((service: Service) => (
                <tr key={service.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {service.icon ? (
                        <img src={service.icon} alt={service.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-gray-500">?</div>
                      )}
                      <p className="font-semibold text-black dark:text-white">{service.title}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
                      {service.description}
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(service)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this service?")) {
                            deleteMutation.mutate(service.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No services found. Add your first service!
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
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="serviceForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input {...register("title", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., Web Development" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea {...register("description", { required: true })} rows={3} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Describe the service..." />
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
                        label="Service Icon (Optional)"
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
                form="serviceForm"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
