

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

export type CreateBlogDto = Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>;
export type UpdateBlogDto = Partial<CreateBlogDto>;
