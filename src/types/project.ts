import { ProjectStatus } from './common';
import { ProjectCategory } from './projectCategory';
import { ProjectView } from './projectView';


export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  features: string[];
  thumbnails: string[];
  liveUrl?: string;
  githubFrontendUrl?: string;
  githubBackendUrl?: string;
  videoUrl?: string;
  technologies: string[];
  role?: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categoryId?: string;
  category?: ProjectCategory;
  projectViews: ProjectView[];
}

export type CreateProjectDto = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;
