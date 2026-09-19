import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { experiences, projectCategories, projectImages, projects, projectTechnologies, settings, technologies, technologyCategories, users } from "../db/schema.js";

export async function getPortfolioContent() {
  const [settingsRows, categories, experienceRows, techCategories, techRows, projectRows, images, projectTechRows] = await Promise.all([
    db.select().from(settings),
    db.select().from(projectCategories).orderBy(asc(projectCategories.sortOrder)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder)),
    db.select().from(technologyCategories).orderBy(asc(technologyCategories.sortOrder)),
    db.select().from(technologies).orderBy(asc(technologies.sortOrder)),
    db.select().from(projects).orderBy(asc(projects.sortOrder)),
    db.select().from(projectImages).orderBy(asc(projectImages.sortOrder)),
    db.select().from(projectTechnologies)
  ]);

  const settingsObject = Object.fromEntries(settingsRows.map((row) => [row.key, row.value]));

  return {
    settings: {
      githubUrl: settingsObject.githubUrl ?? "https://github.com/sebastiancortes",
      linkedinUrl: settingsObject.linkedinUrl ?? "https://linkedin.com/in/sebastiancortes",
      email: settingsObject.email ?? "seba.cortes.dev@gmail.com",
      locationEs: settingsObject.locationEs ?? "Santiago, Chile",
      locationEn: settingsObject.locationEn ?? "Santiago, Chile",
      siteTitle: settingsObject.siteTitle ?? "Sebastián Cortés",
      metaDescriptionEs: settingsObject.metaDescriptionEs ?? "CV virtual y portfolio de Sebastián Cortés: desarrollo web, proyectos, herramientas y experimentos.",
      metaDescriptionEn: settingsObject.metaDescriptionEn ?? "Sebastián Cortés' virtual CV and portfolio: web development, projects, tools and experiments."
    },
    categories,
    experiences: experienceRows,
    technologies: techCategories.map((category) => ({
      id: category.id,
      name: category.name,
      sortOrder: category.sortOrder,
      technologies: techRows.filter((tech) => tech.categoryId === category.id).map((tech) => tech.name)
    })),
    projects: projectRows.map((project) => {
      const category = categories.find((item) => item.id === project.categoryId);
      const techIds = projectTechRows.filter((item) => item.projectId === project.id).map((item) => item.technologyId);
      return {
        ...project,
        categorySlug: category?.slug ?? "web",
        technologies: techRows.filter((tech) => techIds.includes(tech.id)).map((tech) => tech.name),
        images: images.filter((image) => image.projectId === project.id)
      };
    })
  };
}

export async function getAdminProjects() {
  const content = await getPortfolioContent();
  return content.projects;
}

export async function findUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).get();
}
