import { Project } from './project';


export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  projects: Project[];
}

export type CreateProjectCategoryDto = Omit<ProjectCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectCategoryDto = Partial<CreateProjectCategoryDto>;
