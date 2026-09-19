import { describe, expect, it } from "vitest";
import { contactMessageSchema, loginSchema, projectSchema } from "@etascript/shared";

describe("contactMessageSchema", () => {
  it("accepts valid messages", () => {
    const parsed = contactMessageSchema.safeParse({
      name: "Sebastian",
      email: "hello@sebastian-cortes.dev",
      message: "Hola, conversemos sobre un proyecto."
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const parsed = contactMessageSchema.safeParse({
      name: "Sebastian",
      email: "bad-email",
      message: "Hola, conversemos sobre un proyecto."
    });
    expect(parsed.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("rejects short passwords", () => {
    const parsed = loginSchema.safeParse({ email: "admin@sebastian-cortes.local", password: "short" });
    expect(parsed.success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("accepts bilingual project payloads", () => {
    const parsed = projectSchema.safeParse({
      id: 1,
      slug: "demo",
      title: "Demo",
      shortDescriptionEs: "Descripcion corta",
      shortDescriptionEn: "Short description",
      descriptionEs: "Descripcion",
      descriptionEn: "Description",
      categoryId: 1,
      categorySlug: "web",
      featured: true,
      published: true,
      sortOrder: 1,
      technologies: ["Vue"],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    expect(parsed.success).toBe(true);
  });
});
