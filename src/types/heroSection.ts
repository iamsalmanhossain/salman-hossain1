import { SocialLink } from './socialLinks';


export interface HeroSection {
  id: string;
  heroTitle: string;
  designations: string[];
  heroDescription?: string;
  profileImage?: string;
  resumeUrl?: string;
  about: string;
  experienceYears?: number;
  totalProjects?: number;
  email?: string;
  phone?: string;
  location?: string;
  socialLinks: SocialLink[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateHeroSectionDto = Omit<HeroSection, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHeroSectionDto = Partial<CreateHeroSectionDto>;
