

export interface AdminPortfolioTemplate {
  id: string;
  templateName: string;
  isActive: boolean;
  personalData: any;
  seoData: any;
  websiteData: any;
  createdAt: string;
  updatedAt: string;
}

export type CreateAdminPortfolioTemplateDto = Omit<AdminPortfolioTemplate, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAdminPortfolioTemplateDto = Partial<CreateAdminPortfolioTemplateDto>;
