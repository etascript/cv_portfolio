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
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${env.publicBaseUrl}/sitemap.xml\n`;
});
app.get("/sitemap.xml", async (request, reply) => {
  const content = await getPortfolioContent();
  const staticPaths = ["/", "/about", "/projects", "/contact"];
  const projectPaths = content.projects
    .filter((project) => project.published)
    .map((project) => ({ path: `/projects/${project.slug}`, lastmod: project.updatedAt }));
  const entries = [
    ...staticPaths.map((path) => ({ path, lastmod: new Date().toISOString() })),
    ...projectPaths
  ];
  const urls = entries
    .flatMap((entry) => ["es", "en"].map((locale) => ({ locale, ...entry })))
    .map(({ locale, path, lastmod }) => sitemapUrl(locale, path, lastmod))
    .join("\n");
  reply.type("application/xml");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
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

function sitemapUrl(locale: string, path: string, lastmod: string) {
  const loc = localizedUrl(locale, path);
  const es = localizedUrl("es", path);
  const en = localizedUrl("en", path);
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>`,
    `    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(es)}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(es)}" />`,
    "  </url>"
  ].join("\n");
}

function localizedUrl(locale: string, path: string) {
  const base = env.publicBaseUrl.replace(/\/$/, "");
  const suffix = path === "/" ? "" : path;
  return `${base}/${locale}${suffix}`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}
