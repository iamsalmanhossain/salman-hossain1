

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
