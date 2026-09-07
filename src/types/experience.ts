export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateExperienceDto = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExperienceDto = Partial<CreateExperienceDto>;
