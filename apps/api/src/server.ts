import Fastify from "fastify";
import { createReadStream, existsSync } from "node:fs";
import { join, normalize } from "node:path";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import { env } from "./env.js";
import authPlugin from "./plugins/auth.js";
import { initDatabase } from "./db/init.js";
import { seedIfEmpty } from "./db/seed.js";
import { adminRoutes } from "./routes/admin.js";
import { authRoutes } from "./routes/auth.js";
import { contentRoutes } from "./routes/content.js";
import { getPortfolioContent } from "./services/content.js";

initDatabase();
await seedIfEmpty();

const app = Fastify({ logger: true });

await app.register(helmet, { contentSecurityPolicy: false });
await app.register(cors, { origin: env.corsOrigin, credentials: true });
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });
await app.register(cookie);
await app.register(jwt, {
  secret: env.jwtSecret,
  cookie: { cookieName: "sebastian_cortes_admin", signed: false }
});
await app.register(multipart, {
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 4
  }
});
await app.register(authPlugin);

app.get("/api/health", async () => ({ ok: true, name: "sebastian-cortes-api" }));
app.get("/robots.txt", async (request, reply) => {
  reply.type("text/plain");
  return `User-agent: *\nAllow: /\n\nSitemap: ${env.publicBaseUrl}/sitemap.xml\n`;
});
app.get("/sitemap.xml", async (request, reply) => {
  const content = await getPortfolioContent();
  const staticPaths = ["/", "/about", "/projects", "/contact"];
  const projectPaths = content.projects.filter((project) => project.published).map((project) => `/projects/${project.slug}`);
  const urls = [...staticPaths, ...projectPaths]
    .flatMap((path) => ["es", "en"].map((locale) => `${env.publicBaseUrl}/${locale}${path}`))
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n");
  reply.type("application/xml");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
});
app.get("/uploads/:file", async (request, reply) => {
  const { file } = request.params as { file: string };
  const safeName = file.replace(/[^a-zA-Z0-9._-]/g, "");
  const filePath = normalize(join(env.uploadDir, safeName));
  if (!filePath.startsWith(normalize(env.uploadDir)) || !existsSync(filePath)) {
    return reply.code(404).send({ message: "Not found" });
  }
  const contentType = safeName.endsWith(".png") ? "image/png" : safeName.endsWith(".webp") ? "image/webp" : safeName.endsWith(".svg") ? "image/svg+xml" : "image/jpeg";
  return reply.type(contentType).send(createReadStream(filePath));
});
await app.register(contentRoutes, { prefix: "/api" });
await app.register(authRoutes, { prefix: "/api" });
await app.register(adminRoutes, { prefix: "/api" });

await app.listen({ port: env.port, host: env.host });
