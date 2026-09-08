export interface Certificate {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  credentialUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCertificateDto = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCertificateDto = Partial<CreateCertificateDto>;
