export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  resumeUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateHeroSectionDto = Omit<HeroSection, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHeroSectionDto = Partial<CreateHeroSectionDto>;
