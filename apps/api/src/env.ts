export const env = {
  port: Number(process.env.PORT ?? 8003),
  host: process.env.HOST ?? "127.0.0.1",
  databaseUrl: process.env.DATABASE_URL ?? "./data/sebastian_cortes.sqlite",
  jwtSecret: process.env.JWT_SECRET ?? "dev-change-me-please",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://127.0.0.1:8002",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@sebastian-cortes.local",
  adminPassword: process.env.ADMIN_PASSWORD ?? "change-me-in-env",
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "https://sebastian-cortes.dev",
  uploadDir: process.env.UPLOAD_DIR ?? "./uploads"
};
