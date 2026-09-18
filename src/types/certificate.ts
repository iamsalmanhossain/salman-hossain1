

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
