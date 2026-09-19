import type { Experience, Project, ProjectCategory, TechnologyCategory } from "@etascript/shared";

export type { Experience, Project, ProjectCategory, TechnologyCategory };

export interface SiteSettings {
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  locationEs: string;
  locationEn: string;
  siteTitle?: string;
  metaDescriptionEs?: string;
  metaDescriptionEn?: string;
}

export interface PortfolioPayload {
  settings: SiteSettings;
  projects: Project[];
  categories: ProjectCategory[];
  experiences: Experience[];
  technologies: TechnologyCategory[];
}
