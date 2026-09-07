export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateEducationDto = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEducationDto = Partial<CreateEducationDto>;
