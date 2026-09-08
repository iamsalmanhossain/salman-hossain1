export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateBlogDto = Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;
export type UpdateBlogDto = Partial<CreateBlogDto>;
