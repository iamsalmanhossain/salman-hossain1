export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined | null;
}

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
