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
