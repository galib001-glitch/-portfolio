export interface Profile {
  name: string;
  shortName: string;
  title: string;
  roles: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  resumeUrl: string;
  availability: string;
  languages: { name: string; level: string }[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  detail: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  period: string;
  points: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  org: string;
  year: string;
  detail: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  category: string;
  skills?: string[];
  credentialId?: string;
  credentialUrl?: string;
  summary?: string;
}

export interface ResearchPaper {
  id: string;
  type: string;
  title: string;
  authors: string[];
  venue: string;
  year: string;
  status?: string;
  abstract: string;
  keywords: string[];
  doi?: string;
  pdfUrl?: string;
  bibtex: string;
}

export interface SkillNode {
  id: string;
  label: string;
  level: number;
}

export interface SkillCategory {
  id: string;
  label: string;
  color: string;
  description?: string;
  skills: SkillNode[];
}

export interface SkillData {
  categories: SkillCategory[];
  core: { id: string; label: string };
}

export interface ManualProject {
  id: string;
  name: string;
  description: string;
  year: string;
  category: "featured" | "practice";
  topics: string[];
  languages: string[];
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
  unpublished?: boolean;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export interface Collaboration {
  id: string;
  title: string;
  area: string;
  description: string;
  status: "running" | "open";
  role?: string;
  since?: string;
  seekingRoles?: string[];
  relatedResearchId?: string;
}

export interface Links {
  github: string;
  githubUsername: string;
  linkedin: string;
  facebook: string;
  pinterest: string;
  email: string;
}
