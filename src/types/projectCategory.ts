export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectCategoryDto = Omit<ProjectCategory, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;
export type UpdateProjectCategoryDto = Partial<CreateProjectCategoryDto>;
