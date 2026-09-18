

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  issuer?: string;
  image?: string;
  achievedAt?: string;
  createdAt: string;
}

export type CreateAchievementDto = Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAchievementDto = Partial<CreateAchievementDto>;
