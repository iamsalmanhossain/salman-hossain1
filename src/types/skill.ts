export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'TOOLS' | 'OTHER';

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  category: SkillCategory;
  createdAt: string;
  updatedAt: string;
}

export type CreateSkillDto = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSkillDto = Partial<CreateSkillDto>;
