import { ContactStatus } from './common';
export type SendMessageDto = Omit<ContactMessage, 'id' | 'createdAt'>;

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
