

export interface GithubStats {
  id: string;
  githubUsername: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  lastSyncedAt?: string;
  updatedAt: string;
}

export type CreateGithubStatsDto = Omit<GithubStats, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGithubStatsDto = Partial<CreateGithubStatsDto>;
