"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "@/services/skill.service";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Skill, CreateSkillDto, SkillCategory } from "@/types/skill";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "@/components/FileUpload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Activity } from "lucide-react";

export default function SkillsDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => SkillService.getSkills(),
  });

  const form = useForm<CreateSkillDto>({
    defaultValues: {
      name: "",
      icon: "",
      level: 80,
      category: "FRONTEND" as SkillCategory,
      showIn3d: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (newSkill: CreateSkillDto) => SkillService.createSkill(newSkill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill created successfully!");
      closeModal();
    },
    onError: () => {
      toast.error("Failed to create skill.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSkillDto> }) => SkillService.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated successfully!");
      closeModal();
    },
    onError: () => {
      toast.error("Failed to update skill.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => SkillService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete skill.");
    }
  });

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingId(skill.id);
      form.reset({
        name: skill.name,
        icon: skill.icon,
        level: skill.level,
        category: skill.category,
        showIn3d: skill.showIn3d !== undefined ? skill.showIn3d : true,
      });
    } else {
      setEditingId(null);
      form.reset({
        name: "",
        icon: "",
        level: 50,
        category: "FRONTEND" as SkillCategory,
        showIn3d: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.reset();
  };

  const onSubmit = (formData: CreateSkillDto) => {
    const dataToSubmit = {
      ...formData,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const filteredSkills = data?.data?.filter((skill: Skill) => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Skills</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your technical skills</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            onClick={() => openModal()} 
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Skill
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-10 space-y-6">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Skill Name</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Category</TableHead>
                <TableHead className="font-semibold text-right text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {filteredSkills?.map((skill: Skill) => (
                <motion.tr 
                  key={skill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {skill.icon && <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />}
                      <span className="font-semibold">{skill.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-md uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(skill)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this skill?")) {
                            deleteMutation.mutate(skill.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === skill.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
              {(!filteredSkills || filteredSkills.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="h-[300px]">
                    <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-black/30 rounded-2xl flex items-center justify-center mb-2 border border-gray-100 dark:border-white/5">
                        <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No skills added</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                        Add the languages, frameworks, and tools you know to showcase them on your portfolio.
                      </p>
                      <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Skill
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-[#1A1C23] border border-gray-200 dark:border-white/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {editingId ? "Update Skill" : "Add New Skill"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="React" 
                        {...field} 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "FRONTEND"}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-gray-900 dark:text-gray-100 h-auto">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FRONTEND">FRONTEND</SelectItem>
                        <SelectItem value="BACKEND">BACKEND</SelectItem>
                        <SelectItem value="DATABASE">DATABASE</SelectItem>
                        <SelectItem value="DEVOPS">DEVOPS</SelectItem>
                        <SelectItem value="TOOL">TOOL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onChange={field.onChange}
                        accept="image/*"
                        label="Upload Skill Icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showIn3d"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 dark:border-white/10 p-4 shadow-sm bg-gray-50 dark:bg-black/50">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 mt-0.5 cursor-pointer"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show in 3D Globe
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Display this skill in the 3D rotating globe on the homepage.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingId ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
