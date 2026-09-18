

export interface SeoSetting {
  id: string;
  siteName?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  author?: string;
  favicon?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSeoSettingDto = Omit<SeoSetting, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSeoSettingDto = Partial<CreateSeoSettingDto>;
