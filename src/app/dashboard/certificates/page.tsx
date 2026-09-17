"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CertificateService } from "@/services/certificate.service";
import { Loader2, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { Certificate, CreateCertificateDto } from "@/types/certificate";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";

export default function CertificatesDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: () => CertificateService.getCertificates(),
  });

  const { register, handleSubmit, reset, setValue, control } = useForm<CreateCertificateDto>();

  const createMutation = useMutation({
    mutationFn: (newCertificate: CreateCertificateDto) => CertificateService.createCertificate(newCertificate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCertificateDto> }) => CertificateService.updateCertificate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CertificateService.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });

  const openModal = (certificate?: Certificate) => {
    if (certificate) {
      setEditingId(certificate.id);
      setValue("name", certificate.name);
      setValue("organization", certificate.organization);
      setValue("issueDate", new Date(certificate.issueDate).toISOString().split('T')[0]);
      setValue("credentialUrl", certificate.credentialUrl);
      setValue("image", certificate.image);
    } else {
      setEditingId(null);
      reset({
        name: "",
        organization: "",
        issueDate: "",
        credentialUrl: "",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (formData: CreateCertificateDto) => {
    const dataToSubmit = {
      ...formData,
      issueDate: new Date(formData.issueDate).toISOString()
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
          <h2 className="text-2xl font-bold text-black dark:text-white">Certificates</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your professional certifications</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Certificate
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
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Organization</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Issue Date</th>
                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((certificate: Certificate) => (
                <tr key={certificate.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-black dark:text-white">{certificate.name}</p>
                    {certificate.credentialUrl && (
                      <a href={certificate.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> View Credential
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{certificate.organization}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(certificate)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this certificate?")) {
                            deleteMutation.mutate(certificate.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === certificate.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No certificates found. Add your first certificate!
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
                {editingId ? "Edit Certificate" : "Add New Certificate"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black dark:hover:text-white">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="certificateForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input {...register("name", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., AWS Certified Developer" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
                  <input {...register("organization", { required: true })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500" placeholder="E.g., Amazon Web Services" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
                  <input {...register("issueDate", { required: true })} type="date" className="w-full px-4 py-2 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-black dark:text-white" />
                </div>

                <div className="space-y-1">
                  <Controller
                    name="credentialUrl"
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="application/pdf,image/*"
                        label="Credential URL (Optional)"
                        isPdf={true}
                      />
                    )}
                  />
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
                        label="Certificate Image (Optional)"
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
                form="certificateForm"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
