# Sebastian Cortes Virtual CV

Virtual CV and personal portfolio for Sebastian Cortes: a retro web interface inspired by late 90s / early 2000s browsers and desktop apps, built with a modern Vue + Fastify architecture.

## Stack

- Web: Vue 3, Vite, TypeScript, Vue Router, Pinia, Vue I18n, custom CSS tokens.
- API: Node.js, TypeScript, Fastify, Drizzle ORM, SQLite, Zod.
- Auth: HttpOnly cookie JWT, Argon2 password hashing, login rate limiting.
- Infra: Docker Compose with persistent SQLite and uploads volumes.

## Architecture

```text
sebastian-cortes-cv/
├── apps/
│   ├── web/   # Vue app, design system, routes, admin UI
│   └── api/   # Fastify API, Drizzle schema, SQLite seed
├── packages/
│   └── shared/ # Shared Zod schemas and TypeScript types
├── docker-compose.yml
└── package.json
```

The database model stores bilingual fields on content entities, so projects are not duplicated by language. SQLite is used initially, with Drizzle keeping the data layer ready for a later PostgreSQL migration.

## Development

```bash
npm install
npm run dev:api
npm run dev:web
```

Web runs on `http://127.0.0.1:8000` and proxies `/api`, `/uploads`, `/sitemap.xml` and `/robots.txt` to `http://127.0.0.1:8001`.

## Environment Variables

Copy `.env.example` and set production values:

```bash
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@sebastian-cortes.local
ADMIN_PASSWORD=change-me-before-production
CORS_ORIGIN=http://localhost:8000
COOKIE_SECURE=false
PUBLIC_BASE_URL=https://sebastian-cortes.dev
UPLOAD_DIR=./uploads
```

## Database

The API initializes the SQLite tables on boot and seeds starter content if empty.

Useful commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Build

```bash
npm run typecheck
npm run test
npm run build
```

## Docker

Production / VPS behind an external reverse proxy network named `proxy`:

```bash
docker compose up --build
```

Local Docker with host ports published:

```bash
docker compose -f docker-compose.local.yml up --build
```

Services:

- `web`: Vue app served by nginx.
- `api`: Fastify API.
- `sebastian_cortes_sqlite`: persistent SQLite volume.
- `sebastian_cortes_uploads`: persistent uploads volume.

## i18n

Initial locales are `es` and `en`. Public URLs are localized:

- `/es/`
- `/es/projects`
- `/es/projects/:slug`
- `/en/`
- `/en/projects`
- `/en/projects/:slug`

## Admin

The admin panel lives at `/admin`.

Implemented:

- Login with HttpOnly JWT cookie.
- Project listing.
- Project create/update/delete endpoints.
- Fields for `featured`, `published` and `sort_order`.
- Screenshot upload for project images.
- Editable settings and SEO metadata.
- Form-based editing for experience and technology groups.
- JSON editor for advanced translation rows.

Next admin expansion points are richer translation forms, project category screens and per-project SEO overrides.

## Uploads

Project screenshots can be uploaded from `/admin/projects/:id/edit`.

Allowed image types:

- PNG
- JPEG
- WebP
- SVG

The API rejects files over 2 MB and serves uploaded assets from `/uploads/:file`.

## SEO

The frontend sets dynamic title, description, OpenGraph, canonical and hreflang tags. Global SEO values are editable from `/admin`.

The API also serves dynamic:

- `/sitemap.xml`
- `/robots.txt`

The sitemap includes public localized pages and published project detail pages.

## Assets

`apps/web/public/assets/` contains original SVG placeholders. Replace project placeholders with real screenshots before publishing the portfolio as a finished case-study site.
