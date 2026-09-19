import type { PortfolioPayload, Project } from "@/types/content";
import { apiFetch } from "./api";

export const fallbackContent: PortfolioPayload = {
  settings: {
    githubUrl: "https://github.com/sebastiancortes",
    linkedinUrl: "https://linkedin.com/in/sebastiancortes",
    email: "seba.cortes.dev@gmail.com",
    locationEs: "Santiago, Chile",
    locationEn: "Santiago, Chile",
    siteTitle: "Sebastián Cortés",
    metaDescriptionEs: "CV virtual y portfolio de Sebastián Cortés: desarrollo web, proyectos, herramientas y experimentos.",
    metaDescriptionEn: "Sebastián Cortés' virtual CV and portfolio: web development, projects, tools and experiments."
  },
  categories: [
    { id: 1, slug: "web", labelEs: "Web", labelEn: "Web", sortOrder: 1 },
    { id: 2, slug: "tools", labelEs: "Herramientas", labelEn: "Tools", sortOrder: 2 },
    { id: 3, slug: "games", labelEs: "Juegos", labelEn: "Games", sortOrder: 3 },
    { id: 4, slug: "experiments", labelEs: "Experimentos", labelEn: "Experiments", sortOrder: 4 }
  ],
  experiences: [
    { id: 1, period: "2023 - Hoy", company: "Yoy Simulators", roleEs: "Desarrollador Web", roleEn: "Web Developer", descriptionEs: "Desarrollo de plataformas y aplicaciones web. Trabajo con Laravel, Vue.js y otras tecnologías según el proyecto.", descriptionEn: "Development of platforms and web applications. Working with Laravel, Vue.js and other technologies depending on each project.", sortOrder: 1 },
    { id: 2, period: "2021 - 2023", company: "Everis Chile", roleEs: "Analista de Sistemas", roleEn: "Systems Analyst", descriptionEs: "Soporte y desarrollo en LATAM Airlines Cargo.", descriptionEn: "Support and development for LATAM Airlines Cargo.", sortOrder: 2 },
    { id: 3, period: "Antes de 2021", company: "Desarrollo y consultoría", roleEs: "Desarrollador", roleEn: "Developer", descriptionEs: "Proyectos en ASP.NET, ERP y SQL Server.", descriptionEn: "Projects with ASP.NET, ERP and SQL Server.", sortOrder: 3 }
  ],
  technologies: [
    { id: 1, name: "Languages", sortOrder: 1, technologies: ["PHP", "JavaScript", "TypeScript", "C#", "SQL"] },
    { id: 2, name: "Frontend", sortOrder: 2, technologies: ["Vue", "Angular", "CSS"] },
    { id: 3, name: "Backend", sortOrder: 3, technologies: ["Laravel", "Node.js", "Fastify", "ASP.NET"] },
    { id: 4, name: "Data", sortOrder: 4, technologies: ["MySQL", "SQL Server", "SQLite"] },
    { id: 5, name: "Infrastructure", sortOrder: 5, technologies: ["Docker", "Linux", "Azure", "CI/CD"] }
  ],
  projects: [
    {
      id: 1,
      slug: "polygon-pong",
      title: "Polygon Pong",
      shortDescriptionEs: "Juego multijugador web con WebGL.",
      shortDescriptionEn: "Multiplayer web game with WebGL.",
      descriptionEs: "Un experimento jugable centrado en físicas sencillas, sincronización y feedback inmediato.",
      descriptionEn: "A playable experiment focused on simple physics, sync and immediate feedback.",
      problemEs: "Explorar mecánicas de arcade rápidas en navegador sin convertir la interfaz en algo pesado.",
      problemEn: "Explore fast arcade mechanics in the browser without making the interface heavy.",
      solutionEs: "Una escena Three.js liviana, lógica de juego separada y controles directos.",
      solutionEn: "A lightweight Three.js scene, separate game logic and direct controls.",
      technicalNotesEs: "TypeScript, render loop controlado y estructura preparada para ampliar modos.",
      technicalNotesEn: "TypeScript, controlled render loop and a structure ready for more modes.",
      lessonsLearnedEs: "El feel del juego depende de pequeños detalles de latencia, cámara y estados.",
      lessonsLearnedEn: "Game feel depends on small details around latency, camera and states.",
      githubUrl: "https://github.com/sebastiancortes/polygon-pong",
      demoUrl: "",
      categoryId: 3,
      categorySlug: "games",
      featured: true,
      published: true,
      sortOrder: 1,
      technologies: ["Three.js", "TypeScript", "WebGL"],
      images: [{ id: 1, projectId: 1, imagePath: "/assets/projects/polygon-pong/placeholder.svg", altEs: "Placeholder de captura para Polygon Pong", altEn: "Screenshot placeholder for Polygon Pong", sortOrder: 1 }],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: 2,
      slug: "tauri-vue-boilerplate",
      title: "tauri-vue-boilerplate",
      shortDescriptionEs: "Base para apps de escritorio con Tauri, Vue y TypeScript.",
      shortDescriptionEn: "Desktop app starter with Tauri, Vue and TypeScript.",
      descriptionEs: "Plantilla técnica para iniciar aplicaciones de escritorio con una arquitectura clara.",
      descriptionEn: "Technical starter for desktop applications with a clear architecture.",
      problemEs: "Reducir trabajo repetitivo al iniciar herramientas internas de escritorio.",
      problemEn: "Reduce repetitive setup when starting internal desktop tools.",
      solutionEs: "Estructura base con Vite, Vue, TypeScript y convenciones simples.",
      solutionEn: "Base structure with Vite, Vue, TypeScript and simple conventions.",
      technicalNotesEs: "Separación entre UI, servicios y tipos compartidos.",
      technicalNotesEn: "Separation between UI, services and shared types.",
      lessonsLearnedEs: "Una plantilla útil debe ser pequeña y fácil de borrar.",
      lessonsLearnedEn: "A useful starter should stay small and easy to delete.",
      githubUrl: "https://github.com/sebastiancortes/tauri-vue-boilerplate",
      demoUrl: "",
      categoryId: 2,
      categorySlug: "tools",
      featured: true,
      published: true,
      sortOrder: 2,
      technologies: ["Tauri", "Vue", "TypeScript"],
      images: [{ id: 2, projectId: 2, imagePath: "/assets/projects/portfolio/placeholder.svg", altEs: "Placeholder de captura para boilerplate", altEn: "Screenshot placeholder for boilerplate", sortOrder: 1 }],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: 3,
      slug: "sistema-biblioteca-duoc",
      title: "sistema-biblioteca-duoc",
      shortDescriptionEs: "Sistema de gestión de biblioteca.",
      shortDescriptionEn: "Library management system.",
      descriptionEs: "Aplicación de gestión para organizar flujos administrativos de biblioteca.",
      descriptionEn: "Management application for library administrative workflows.",
      problemEs: "Centralizar consultas, registros y operaciones frecuentes.",
      problemEn: "Centralize queries, records and frequent operations.",
      solutionEs: "Interfaz web con entidades claras y operaciones mantenibles.",
      solutionEn: "Web interface with clear entities and maintainable operations.",
      technicalNotesEs: "Modelo relacional, validaciones y vistas administrativas.",
      technicalNotesEn: "Relational model, validations and administrative views.",
      lessonsLearnedEs: "La claridad de datos importa tanto como la pantalla.",
      lessonsLearnedEn: "Data clarity matters as much as the screen.",
      githubUrl: "",
      demoUrl: "",
      categoryId: 1,
      categorySlug: "web",
      featured: true,
      published: true,
      sortOrder: 3,
      technologies: ["PHP", "Laravel", "MySQL"],
      images: [{ id: 3, projectId: 3, imagePath: "/assets/projects/project-03/placeholder.svg", altEs: "Placeholder de captura para sistema biblioteca", altEn: "Screenshot placeholder for library system", sortOrder: 1 }],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: 4,
      slug: "imprenta-pacifico",
      title: "imprenta-pacifico",
      shortDescriptionEs: "Plataforma de gestión para una imprenta.",
      shortDescriptionEn: "Management platform for a print shop.",
      descriptionEs: "Sistema web orientado a ordenar pedidos, clientes y procesos internos.",
      descriptionEn: "Web system to organize orders, clients and internal processes.",
      problemEs: "Dar trazabilidad a operaciones que suelen perderse en planillas o mensajes.",
      problemEn: "Give traceability to operations that often get lost in sheets or messages.",
      solutionEs: "CRUDs simples, estados claros y panel de seguimiento.",
      solutionEn: "Simple CRUDs, clear states and a tracking panel.",
      technicalNotesEs: "Backend Laravel y frontend pensado para uso repetido.",
      technicalNotesEn: "Laravel backend and frontend designed for repeated use.",
      lessonsLearnedEs: "Las herramientas internas necesitan menos brillo y más velocidad.",
      lessonsLearnedEn: "Internal tools need less gloss and more speed.",
      githubUrl: "",
      demoUrl: "",
      categoryId: 1,
      categorySlug: "web",
      featured: false,
      published: true,
      sortOrder: 4,
      technologies: ["Laravel", "Vue", "MySQL"],
      images: [{ id: 4, projectId: 4, imagePath: "/assets/projects/project-04/placeholder.svg", altEs: "Placeholder de captura para imprenta", altEn: "Screenshot placeholder for print shop", sortOrder: 1 }],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    }
  ]
};

export async function getPortfolioContent() {
  try {
    return await apiFetch<PortfolioPayload>("/content");
  } catch {
    return fallbackContent;
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const content = await getPortfolioContent();
  return content.projects.find((project) => project.slug === slug);
}
