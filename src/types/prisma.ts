// Auto-generated from Prisma Schema

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  TOOL = 'TOOL',
}

export enum ContactStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  REPLIED = 'REPLIED',
}

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

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateBlogDto = Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBlogDto = Partial<CreateBlogDto>;

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialUrl?: string;
  image?: string;
  issueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCertificateDto = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCertificateDto = Partial<CreateCertificateDto>;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export type CreateContactMessageDto = Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContactMessageDto = Partial<CreateContactMessageDto>;

export interface Education {
  id: string;
  institute: string;
  degree: string;
  field?: string;
  image?: string;
  startYear: number;
  endYear?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateEducationDto = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEducationDto = Partial<CreateEducationDto>;

export interface Experience {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateExperienceDto = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExperienceDto = Partial<CreateExperienceDto>;

export interface GithubStats {
  id: string;
  githubUsername: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  lastSyncedAt?: string;
  updatedAt: string;
}

export type CreateGithubStatsDto = Omit<GithubStats, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGithubStatsDto = Partial<CreateGithubStatsDto>;

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

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  features: string[];
  thumbnails: string[];
  liveUrl?: string;
  githubFrontendUrl?: string;
  githubBackendUrl?: string;
  videoUrl?: string;
  technologies: string[];
  role?: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categoryId?: string;
  category?: ProjectCategory;
  projectViews: ProjectView[];
}

export type CreateProjectDto = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  projects: Project[];
}

export type CreateProjectCategoryDto = Omit<ProjectCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectCategoryDto = Partial<CreateProjectCategoryDto>;

export interface ProjectView {
  id: string;
  projectId: string;
  viewedAt: string;
  project: Project;
}

export type CreateProjectViewDto = Omit<ProjectView, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectViewDto = Partial<CreateProjectViewDto>;

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

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateServiceDto = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateServiceDto = Partial<CreateServiceDto>;

export interface Session {
  id: string;
  userId: string;
  sessionId: string;
  refreshToken: string;
  deviceInfo?: string;
  ipAddress?: string;
  expiresAt: string;
  createdAt: string;
  user: User;
}

export type CreateSessionDto = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSessionDto = Partial<CreateSessionDto>;

export interface Skill {
  id: string;
  name: string;
  icon?: string;
  level?: number;
  category: SkillCategory;
  createdAt: string;
  updatedAt: string;
}

export type CreateSkillDto = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSkillDto = Partial<CreateSkillDto>;

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

export type CreateSocialLinkDto = Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSocialLinkDto = Partial<CreateSocialLinkDto>;

export interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  image?: string;
  review: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTestimonialDto = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTestimonialDto = Partial<CreateTestimonialDto>;

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  status: UserStatus;
  deletedAt?: string;
  deleteAfter?: string;
  createdAt: string;
  updatedAt: string;
  sessions: Session[];
}

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export interface VisitorAnalytics {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  page: string;
  createdAt: string;
}

export type CreateVisitorAnalyticsDto = Omit<VisitorAnalytics, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVisitorAnalyticsDto = Partial<CreateVisitorAnalyticsDto>;

