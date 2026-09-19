import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const contentSections = sqliteTable("content_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  titleEs: text("title_es").notNull().default(""),
  titleEn: text("title_en").notNull().default(""),
  bodyEs: text("body_es").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  updatedAt: text("updated_at").notNull()
});

export const experiences = sqliteTable("experiences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  period: text("period").notNull(),
  company: text("company").notNull(),
  roleEs: text("role_es").notNull(),
  roleEn: text("role_en").notNull(),
  descriptionEs: text("description_es").notNull(),
  descriptionEn: text("description_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const technologyCategories = sqliteTable("technology_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const technologies = sqliteTable("technologies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").notNull().references(() => technologyCategories.id),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const projectCategories = sqliteTable("project_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  labelEs: text("label_es").notNull(),
  labelEn: text("label_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescriptionEs: text("short_description_es").notNull(),
  shortDescriptionEn: text("short_description_en").notNull(),
  descriptionEs: text("description_es").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  problemEs: text("problem_es").notNull().default(""),
  problemEn: text("problem_en").notNull().default(""),
  solutionEs: text("solution_es").notNull().default(""),
  solutionEn: text("solution_en").notNull().default(""),
  technicalNotesEs: text("technical_notes_es").notNull().default(""),
  technicalNotesEn: text("technical_notes_en").notNull().default(""),
  lessonsLearnedEs: text("lessons_learned_es").notNull().default(""),
  lessonsLearnedEn: text("lessons_learned_en").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  demoUrl: text("demo_url").notNull().default(""),
  categoryId: integer("category_id").notNull().references(() => projectCategories.id),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const projectTechnologies = sqliteTable("project_technologies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id),
  technologyId: integer("technology_id").notNull().references(() => technologies.id)
}, (table) => ({ uniqueProjectTechnology: uniqueIndex("project_technology_unique").on(table.projectId, table.technologyId) }));

export const projectImages = sqliteTable("project_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id),
  imagePath: text("image_path").notNull(),
  altEs: text("alt_es").notNull(),
  altEn: text("alt_en").notNull(),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const translations = sqliteTable("translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
  locale: text("locale").notNull(),
  value: text("value").notNull()
}, (table) => ({ uniqueTranslation: uniqueIndex("translation_unique").on(table.key, table.locale) }));

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull()
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  category: one(projectCategories, { fields: [projects.categoryId], references: [projectCategories.id] }),
  images: many(projectImages),
  technologies: many(projectTechnologies)
}));
