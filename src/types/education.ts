

export interface Education {
  id: string;
  institute: string;
  degree: string;
  field?: string;
  image?: string;
  startYear: number;
  endYear?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateEducationDto = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEducationDto = Partial<CreateEducationDto>;
