import { Project } from './project';


export interface ProjectView {
  id: string;
  projectId: string;
  viewedAt: string;
  project: Project;
}

export type CreateProjectViewDto = Omit<ProjectView, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectViewDto = Partial<CreateProjectViewDto>;
