import type { FastifyPluginAsync } from "fastify";
import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, sqlite } from "../db/client.js";
import { projectImages, projects } from "../db/schema.js";
import { env } from "../env.js";
import { getAdminProjects, getPortfolioContent } from "../services/content.js";

const projectInput = z.object({
  slug: z.string().min(2).max(120),
  title: z.string().min(2).max(180),
  shortDescriptionEs: z.string().min(2),
  shortDescriptionEn: z.string().min(2),
  descriptionEs: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  problemEs: z.string().optional().default(""),
  problemEn: z.string().optional().default(""),
  solutionEs: z.string().optional().default(""),
  solutionEn: z.string().optional().default(""),
  technicalNotesEs: z.string().optional().default(""),
  technicalNotesEn: z.string().optional().default(""),
  lessonsLearnedEs: z.string().optional().default(""),
  lessonsLearnedEn: z.string().optional().default(""),
  githubUrl: z.string().optional().default(""),
  demoUrl: z.string().optional().default(""),
  categoryId: z.number().int().positive(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  sortOrder: z.number().int().default(0)
});

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/admin/content-management", async () => {
    const content = await getPortfolioContent();
    const translations = sqlite.prepare("SELECT key, locale, value FROM translations ORDER BY key, locale").all();
    return { ...content, translations };
  });

  fastify.put("/admin/settings", async (request, reply) => {
    const parsed = z.record(z.string(), z.string()).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid settings" });
    const now = new Date().toISOString();
    const statement = sqlite.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at");
    Object.entries(parsed.data).forEach(([key, value]) => statement.run(key, value, now));
    return { ok: true };
  });

  fastify.put("/admin/experiences", async (request, reply) => {
    const parsed = z.array(z.object({
      period: z.string(),
      company: z.string(),
      roleEs: z.string(),
      roleEn: z.string(),
      descriptionEs: z.string(),
      descriptionEn: z.string(),
      sortOrder: z.number()
    })).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid experiences" });
    const insert = sqlite.prepare("INSERT INTO experiences (period, company, role_es, role_en, description_es, description_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
    sqlite.transaction(() => {
      sqlite.prepare("DELETE FROM experiences").run();
      parsed.data.forEach((item) => insert.run(item.period, item.company, item.roleEs, item.roleEn, item.descriptionEs, item.descriptionEn, item.sortOrder));
    })();
    return { ok: true };
  });

  fastify.put("/admin/technologies", async (request, reply) => {
    const parsed = z.array(z.object({
      name: z.string(),
      sortOrder: z.number(),
      technologies: z.array(z.string())
    })).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid technologies" });
    const insertCategory = sqlite.prepare("INSERT INTO technology_categories (name, sort_order) VALUES (?, ?)");
    const insertTech = sqlite.prepare("INSERT INTO technologies (category_id, name, sort_order) VALUES (?, ?, ?)");
    sqlite.transaction(() => {
      sqlite.prepare("DELETE FROM project_technologies").run();
      sqlite.prepare("DELETE FROM technologies").run();
      sqlite.prepare("DELETE FROM technology_categories").run();
      parsed.data.forEach((group) => {
        const result = insertCategory.run(group.name, group.sortOrder);
        group.technologies.forEach((tech, index) => insertTech.run(result.lastInsertRowid, tech, index + 1));
      });
    })();
    return { ok: true };
  });

  fastify.put("/admin/translations", async (request, reply) => {
    const parsed = z.array(z.object({ key: z.string(), locale: z.enum(["es", "en"]), value: z.string() })).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid translations" });
    const insert = sqlite.prepare("INSERT INTO translations (key, locale, value) VALUES (?, ?, ?)");
    sqlite.transaction(() => {
      sqlite.prepare("DELETE FROM translations").run();
      parsed.data.forEach((item) => insert.run(item.key, item.locale, item.value));
    })();
    return { ok: true };
  });

  fastify.get("/admin/projects", async () => getAdminProjects());

  fastify.get("/admin/projects/:id", async (request) => {
    const params = z.object({ id: z.coerce.number().int().positive() }).parse(request.params);
    const [project] = await db.select().from(projects).where(eq(projects.id, params.id));
    return project;
  });

  fastify.post("/admin/projects/:id/images", async (request, reply) => {
    const params = z.object({ id: z.coerce.number().int().positive() }).parse(request.params);
    const data = await request.file();
    if (!data) return reply.code(400).send({ message: "Missing file" });

    const allowed = new Map([
      ["image/png", ".png"],
      ["image/jpeg", ".jpg"],
      ["image/webp", ".webp"],
      ["image/svg+xml", ".svg"]
    ]);
    const extension = allowed.get(data.mimetype) ?? extname(data.filename).toLowerCase();
    if (![...allowed.values()].includes(extension)) {
      return reply.code(400).send({ message: "Invalid file type" });
    }

    const buffer = await data.toBuffer();
    if (buffer.length > 2 * 1024 * 1024) {
      return reply.code(400).send({ message: "File too large" });
    }

    mkdirSync(env.uploadDir, { recursive: true });
    const fileName = `project-${params.id}-${Date.now()}${extension}`;
    writeFileSync(join(env.uploadDir, fileName), buffer);
    const path = `/uploads/${fileName}`;
    const altEs = String(data.fields.altEs && "value" in data.fields.altEs ? data.fields.altEs.value : "Screenshot de proyecto");
    const altEn = String(data.fields.altEn && "value" in data.fields.altEn ? data.fields.altEn.value : "Project screenshot");

    const [image] = await db.insert(projectImages).values({
      projectId: params.id,
      imagePath: path,
      altEs,
      altEn,
      sortOrder: 1
    }).returning();

    return image;
  });

  fastify.post("/admin/projects", async (request, reply) => {
    const parsed = projectInput.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid project" });
    const now = new Date().toISOString();
    const [created] = await db.insert(projects).values({ ...parsed.data, createdAt: now, updatedAt: now }).returning();
    return created;
  });

  fastify.put("/admin/projects/:id", async (request, reply) => {
    const params = z.object({ id: z.coerce.number().int().positive() }).parse(request.params);
    const parsed = projectInput.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Invalid project" });
    const [updated] = await db.update(projects).set({ ...parsed.data, updatedAt: new Date().toISOString() }).where(eq(projects.id, params.id)).returning();
    return updated;
  });

  fastify.delete("/admin/projects/:id", async (request) => {
    const params = z.object({ id: z.coerce.number().int().positive() }).parse(request.params);
    await db.delete(projects).where(eq(projects.id, params.id));
    return { ok: true };
  });
};
