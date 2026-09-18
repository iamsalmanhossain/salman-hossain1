export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'TOOL';

export interface Skill {
  id: string;
  name: string;
  icon?: string;
  level?: number;
  category: SkillCategory;
  showIn3d?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateSkillDto = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSkillDto = Partial<CreateSkillDto>;
