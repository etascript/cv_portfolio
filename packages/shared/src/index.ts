import { z } from "zod";

export const localeSchema = z.enum(["es", "en"]);
export type Locale = z.infer<typeof localeSchema>;

export const projectCategorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  labelEs: z.string(),
  labelEn: z.string(),
  sortOrder: z.number()
});

export const projectImageSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  imagePath: z.string(),
  altEs: z.string(),
  altEn: z.string(),
  sortOrder: z.number()
});

export const projectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  shortDescriptionEs: z.string(),
  shortDescriptionEn: z.string(),
  descriptionEs: z.string(),
  descriptionEn: z.string(),
  problemEs: z.string().optional().default(""),
  problemEn: z.string().optional().default(""),
  solutionEs: z.string().optional().default(""),
  solutionEn: z.string().optional().default(""),
  technicalNotesEs: z.string().optional().default(""),
  technicalNotesEn: z.string().optional().default(""),
  lessonsLearnedEs: z.string().optional().default(""),
  lessonsLearnedEn: z.string().optional().default(""),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.number(),
  categorySlug: z.string(),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number(),
  technologies: z.array(z.string()),
  images: z.array(projectImageSchema),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const experienceSchema = z.object({
  id: z.number(),
  period: z.string(),
  company: z.string(),
  roleEs: z.string(),
  roleEn: z.string(),
  descriptionEs: z.string(),
  descriptionEn: z.string(),
  sortOrder: z.number()
});

export const technologyCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  sortOrder: z.number(),
  technologies: z.array(z.string())
});

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  message: z.string().min(10).max(4000)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200)
});

export type ProjectCategory = z.infer<typeof projectCategorySchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type TechnologyCategory = z.infer<typeof technologyCategorySchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
