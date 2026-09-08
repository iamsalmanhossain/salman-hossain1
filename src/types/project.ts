export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProjectDto = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;
