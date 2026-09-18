"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SkillService } from "@/services/skill.service";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
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

export default function SkillsDashboard() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => SkillService.getSkills(),
  });

  const form = useForm<CreateSkillDto>({
    defaultValues: {
      name: "",
      icon: "",
      level: 50,
      category: "FRONTEND" as SkillCategory,
    },
  });

  const watchLevel = form.watch("level");

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
      });
    } else {
      setEditingId(null);
      form.reset({
        name: "",
        icon: "",
        level: 50,
        category: "FRONTEND" as SkillCategory,
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
      level: Number(formData.level),
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
          <h2 className="text-2xl font-bold text-foreground">Skills</h2>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((skill: Skill) => (
                <TableRow key={skill.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {skill.icon && <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />}
                      <span className="font-semibold">{skill.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
                      {skill.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[120px]">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{skill.level}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(skill)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this skill?")) {
                            deleteMutation.mutate(skill.id);
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        {deleteMutation.isPending && deleteMutation.variables === skill.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">
                    No skills found. Add your first skill!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="React" {...field} />
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "FRONTEND"}>
                      <FormControl>
                        <SelectTrigger>
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency Level ({watchLevel || 50}%)</FormLabel>
                    <FormControl>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        className="w-full accent-primary"
                        {...field}
                      />
                    </FormControl>
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
                        label="Skill Icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingId ? "Save Changes" : "Create Skill"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
