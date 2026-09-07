export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSocialLinkDto = Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSocialLinkDto = Partial<CreateSocialLinkDto>;
