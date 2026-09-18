import { HeroSection } from './heroSection';


export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconUrl?: string;
  heroSectionId: string;
  heroSection: HeroSection;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateSocialLinkDto = Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt' | 'heroSection'>;
export type UpdateSocialLinkDto = Partial<CreateSocialLinkDto>;
