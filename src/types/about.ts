export interface IAbout {
  id: string;
  name: string;
  headline: string;
  shortBio: string;
  description: string;
  profileImage?: string;
  resumeUrl?: string;
  location?: string;
  email?: string;
  availability: boolean;
  experienceYears: number;
  projectsCount: number;
  clientsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAbout extends Omit<IAbout, "id" | "createdAt" | "updatedAt"> {}
export interface IUpdateAbout extends Partial<ICreateAbout> {}
