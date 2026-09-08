export interface SeoSetting {
  id: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSeoSettingDto = Omit<SeoSetting, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSeoSettingDto = Partial<CreateSeoSettingDto>;
