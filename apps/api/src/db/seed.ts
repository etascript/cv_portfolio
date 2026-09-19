import argon2 from "argon2";
import { sqlite } from "./client.js";
import { initDatabase } from "./init.js";
import { env } from "../env.js";

export async function seedIfEmpty() {
  initDatabase();
  const userCount = sqlite.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const now = new Date().toISOString();
    const passwordHash = await argon2.hash(env.adminPassword);
    sqlite.prepare("INSERT INTO users (email, password_hash, role, created_at, updated_at) VALUES (?, ?, 'admin', ?, ?)").run(env.adminEmail, passwordHash, now, now);
  }

  const categoryCount = sqlite.prepare("SELECT COUNT(*) as count FROM project_categories").get() as { count: number };
  if (categoryCount.count > 0) return;

  const now = new Date().toISOString();
  const insertSetting = sqlite.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
  [
    ["githubUrl", "https://github.com/sebastiancortes"],
    ["linkedinUrl", "https://linkedin.com/in/sebastiancortes"],
    ["email", "seba.cortes.dev@gmail.com"],
    ["locationEs", "Santiago, Chile"],
    ["locationEn", "Santiago, Chile"],
    ["siteTitle", "Sebastián Cortés"],
    ["metaDescriptionEs", "CV virtual y portfolio de Sebastián Cortés: desarrollo web, proyectos, herramientas y experimentos."],
    ["metaDescriptionEn", "Sebastián Cortés' virtual CV and portfolio: web development, projects, tools and experiments."]
  ].forEach(([key, value]) => insertSetting.run(key, value, now));

  const insertCategory = sqlite.prepare("INSERT INTO project_categories (slug, label_es, label_en, sort_order) VALUES (?, ?, ?, ?)");
  [["web", "Web", "Web", 1], ["tools", "Herramientas", "Tools", 2], ["games", "Juegos", "Games", 3], ["experiments", "Experimentos", "Experiments", 4]].forEach((row) => insertCategory.run(...row));

  const insertExperience = sqlite.prepare("INSERT INTO experiences (period, company, role_es, role_en, description_es, description_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
  [
    ["2023 - Hoy", "Yoy Simulators", "Desarrollador Web", "Web Developer", "Desarrollo de plataformas y aplicaciones web. Trabajo con Laravel, Vue.js y otras tecnologías según el proyecto.", "Development of platforms and web applications. Working with Laravel, Vue.js and other technologies depending on each project.", 1],
    ["2021 - 2023", "Everis Chile", "Analista de Sistemas", "Systems Analyst", "Soporte y desarrollo en LATAM Airlines Cargo.", "Support and development for LATAM Airlines Cargo.", 2],
    ["Antes de 2021", "Desarrollo y consultoría", "Desarrollador", "Developer", "Proyectos en ASP.NET, ERP y SQL Server.", "Projects with ASP.NET, ERP and SQL Server.", 3]
  ].forEach((row) => insertExperience.run(...row));

  const insertTechCategory = sqlite.prepare("INSERT INTO technology_categories (name, sort_order) VALUES (?, ?)");
  const insertTech = sqlite.prepare("INSERT INTO technologies (category_id, name, sort_order) VALUES (?, ?, ?)");
  const techGroups = [
    ["Languages", ["PHP", "JavaScript", "TypeScript", "C#", "SQL"]],
    ["Frontend", ["Vue", "Angular", "CSS"]],
    ["Backend", ["Laravel", "Node.js", "Fastify", "ASP.NET"]],
    ["Data", ["MySQL", "SQL Server", "SQLite"]],
    ["Infrastructure", ["Docker", "Linux", "Azure", "CI/CD"]]
  ] as const;
  techGroups.forEach(([name, items], groupIndex) => {
    const result = insertTechCategory.run(name, groupIndex + 1);
    items.forEach((item, index) => insertTech.run(result.lastInsertRowid, item, index + 1));
  });

  const insertProject = sqlite.prepare(`
    INSERT INTO projects (
      slug, title, short_description_es, short_description_en, description_es, description_en,
      problem_es, problem_en, solution_es, solution_en, technical_notes_es, technical_notes_en,
      lessons_learned_es, lessons_learned_en, github_url, demo_url, category_id, featured, published,
      sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const projects = [
    ["polygon-pong", "Polygon Pong", "Juego multijugador web con WebGL.", "Multiplayer web game with WebGL.", "Un experimento jugable centrado en físicas sencillas, sincronización y feedback inmediato.", "A playable experiment focused on simple physics, sync and immediate feedback.", "Explorar mecánicas de arcade rápidas en navegador.", "Explore fast arcade mechanics in the browser.", "Escena Three.js liviana, lógica separada y controles directos.", "Lightweight Three.js scene, separate logic and direct controls.", "TypeScript, render loop controlado y estructura ampliable.", "TypeScript, controlled render loop and extendable structure.", "El feel depende de detalles de latencia, cámara y estados.", "Game feel depends on latency, camera and states.", "https://github.com/sebastiancortes/polygon-pong", "", 3, 1, 1, 1],
    ["tauri-vue-boilerplate", "tauri-vue-boilerplate", "Base para apps de escritorio con Tauri, Vue y TypeScript.", "Desktop app starter with Tauri, Vue and TypeScript.", "Plantilla técnica para iniciar aplicaciones de escritorio con una arquitectura clara.", "Technical starter for desktop applications with a clear architecture.", "Reducir trabajo repetitivo al iniciar herramientas internas.", "Reduce repetitive setup for internal tools.", "Estructura base con Vite, Vue, TypeScript y convenciones simples.", "Base structure with Vite, Vue, TypeScript and simple conventions.", "Separación entre UI, servicios y tipos compartidos.", "Separation between UI, services and shared types.", "Una plantilla útil debe ser pequeña y fácil de borrar.", "A useful starter should stay small and easy to delete.", "https://github.com/sebastiancortes/tauri-vue-boilerplate", "", 2, 1, 1, 2],
    ["sistema-biblioteca-duoc", "sistema-biblioteca-duoc", "Sistema de gestión de biblioteca.", "Library management system.", "Aplicación de gestión para organizar flujos administrativos de biblioteca.", "Management application for library administrative workflows.", "Centralizar consultas, registros y operaciones frecuentes.", "Centralize queries, records and frequent operations.", "Interfaz web con entidades claras y operaciones mantenibles.", "Web interface with clear entities and maintainable operations.", "Modelo relacional, validaciones y vistas administrativas.", "Relational model, validations and administrative views.", "La claridad de datos importa tanto como la pantalla.", "Data clarity matters as much as the screen.", "", "", 1, 1, 1, 3],
    ["imprenta-pacifico", "imprenta-pacifico", "Plataforma de gestión para una imprenta.", "Management platform for a print shop.", "Sistema web orientado a ordenar pedidos, clientes y procesos internos.", "Web system to organize orders, clients and internal processes.", "Dar trazabilidad a operaciones que suelen perderse en planillas o mensajes.", "Give traceability to operations often lost in sheets or messages.", "CRUDs simples, estados claros y panel de seguimiento.", "Simple CRUDs, clear states and tracking panel.", "Backend Laravel y frontend pensado para uso repetido.", "Laravel backend and frontend designed for repeated use.", "Las herramientas internas necesitan menos brillo y más velocidad.", "Internal tools need less gloss and more speed.", "", "", 1, 0, 1, 4]
  ];

  const insertImage = sqlite.prepare("INSERT INTO project_images (project_id, image_path, alt_es, alt_en, sort_order) VALUES (?, ?, ?, ?, 1)");
  projects.forEach((project) => {
    const result = insertProject.run(...project, now, now);
    const slug = String(project[0]);
    const folder = slug === "tauri-vue-boilerplate" ? "portfolio" : slug === "sistema-biblioteca-duoc" ? "project-03" : slug === "imprenta-pacifico" ? "project-04" : slug;
    insertImage.run(result.lastInsertRowid, `/assets/projects/${folder}/placeholder.svg`, `Placeholder de captura para ${project[1]}`, `Screenshot placeholder for ${project[1]}`);
  });

  const techByName = new Map((sqlite.prepare("SELECT id, name FROM technologies").all() as { id: number; name: string }[]).map((row) => [row.name, row.id]));
  const projectBySlug = new Map((sqlite.prepare("SELECT id, slug FROM projects").all() as { id: number; slug: string }[]).map((row) => [row.slug, row.id]));
  const insertProjectTech = sqlite.prepare("INSERT OR IGNORE INTO project_technologies (project_id, technology_id) VALUES (?, ?)");
  const map: Record<string, string[]> = {
    "polygon-pong": ["TypeScript"],
    "tauri-vue-boilerplate": ["Vue", "TypeScript"],
    "sistema-biblioteca-duoc": ["PHP", "Laravel", "MySQL"],
    "imprenta-pacifico": ["Laravel", "Vue", "MySQL"]
  };
  Object.entries(map).forEach(([slug, techs]) => {
    techs.forEach((tech) => insertProjectTech.run(projectBySlug.get(slug), techByName.get(tech)));
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await seedIfEmpty();
  console.log("Database seeded.");
}
