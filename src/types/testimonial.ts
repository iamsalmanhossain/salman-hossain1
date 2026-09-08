export interface Testimonial {
  id: string;
  clientName: string;
  designation?: string;
  message: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateTestimonialDto = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTestimonialDto = Partial<CreateTestimonialDto>;
