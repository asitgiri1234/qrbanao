# QRbanao

> The operating system for modern restaurants — digital QR menus today; orders, payments, and analytics tomorrow.

QRbanao is a **multi-tenant SaaS platform** that lets restaurant owners create digital QR menus, manage their venues, and eventually run their entire business online. Think *Shopify, but for restaurants*.

This repository contains **Phase 1 (Foundation)**: a production-grade auth + restaurant-management core that the rest of the product (menus, QR, ordering, payments, analytics) will be built on top of — without major refactoring.

---

## ✨ What you can do in Phase 1

- Visit a premium SaaS **landing page**
- **Sign up** and **log in** (JWT access + rotating refresh tokens)
- **Create restaurants** (a user can own many)
- View a professional **dashboard** with empty/loading/error states, quick actions, and a roadmap of "coming soon" features

> Deliberately **out of scope** for Phase 1: menu management, QR generation, ordering, payments, analytics. The architecture is designed so these slot in later.

---

## 🧱 Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 15** (App Router) + TypeScript | RSC-ready, file-based routing, great DX, SSR/edge path for future SEO menus |
| Styling | **Tailwind CSS v4** + **shadcn/ui** | Design-token driven, accessible primitives we own (no black-box UI lib) |
| Data fetching | **TanStack Query** | Caching, loading/error states, mutations + invalidation out of the box |
| Forms | **React Hook Form** + **Zod** | Performant forms with one schema shared by validation + types |
| Backend | **Node.js + Express + TypeScript** | Mature, flexible, easy to layer cleanly |
| ORM | **Prisma** | Type-safe queries, painless migrations, great Postgres support |
| Database | **PostgreSQL** | Relational integrity for a multi-tenant, transactional domain |
| Auth | **JWT** access + **rotating refresh tokens**, **bcrypt** | Stateless requests + server-side revocation |
| Validation | **Zod** (both ends) | Single source of truth for input contracts |
| Deployment | **Docker** + **Docker Compose** | One command to run the whole stack |

---

## 🏛 Architecture & key decisions

### Backend — Clean / layered architecture

```
backend/src/
├── config/        env validation (Zod) + Prisma singleton
├── routes/        HTTP route definitions only
├── controllers/   thin: parse request → call service → format response
├── services/      ALL business logic + rules
├── repositories/  the ONLY layer that touches Prisma
├── middlewares/   auth, validation, centralized error handling
├── validators/    Zod schemas (request contracts)
├── utils/         AppError, jwt, password, slug, crypto, helpers
└── types/         Express type augmentation (req.user)
```

**Request flow:** `route → validate middleware → (auth middleware) → controller → service → repository → Prisma`.

Why this matters:

- **Thin controllers, fat services.** Controllers never contain business rules, so they stay trivial and testable. Rules live in services where they can be unit-tested without HTTP.
- **Repository layer = Dependency Inversion (SOLID).** Services depend on repository *functions*, never on Prisma directly. We can swap the data store or mock it in tests without touching business logic.
- **Centralized error handling.** Services throw typed `AppError`s (or Prisma errors); a single error middleware shapes every response into a consistent `{ success, message, errors? }` envelope and hides internals in production.
- **Validation at the boundary.** Zod schemas validate `body/params/query` *before* a controller runs, and the parsed/coerced values are written back to the request — so handlers receive clean, typed input.
- **Fail-fast config.** `config/env.ts` validates environment variables at boot. A missing JWT secret crashes immediately, not mid-request.

### Authentication — why rotating refresh tokens

- **Access token**: short-lived (15m), **stateless** JWT sent as a `Bearer` header. Never stored on disk.
- **Refresh token**: long-lived (7d) JWT delivered as an **httpOnly, SameSite cookie** (JavaScript can't read it → XSS-safe). We persist only its **SHA-256 hash** so a DB leak can't be replayed.
- **Rotation**: every `/auth/refresh` revokes the presented token and issues a new pair. Combined with server-side storage, this gives us **revocation** (logout, account deletion, "log out everywhere") that pure-JWT setups lack.
- **bcrypt** (12 rounds) for password hashing; login uses a **generic error** to avoid user enumeration.

### Multi-tenancy & data isolation

- Every restaurant has an `ownerId`. The `restaurantService` centralizes the **ownership guard** (`getOwnedById`) so no controller can accidentally read another tenant's data.
- Cross-tenant access returns **404 (not 403)** so we never reveal that an id exists for someone else.
- Unique `slug` per restaurant reserves the future public route **`/qr/{slug}`**.

### Frontend — decisions

- **Access token in memory only** (not `localStorage`) to shrink the XSS blast radius; the httpOnly refresh cookie keeps you logged in across reloads via a **silent refresh** on app start.
- A single **`api-client`** wrapper transparently retries once on `401` after refreshing, and **de-duplicates concurrent refreshes** so a burst of requests triggers one refresh round-trip.
- **TanStack Query** owns server state (caching, invalidation, loading/error). **React Context** owns only the session.
- **Design tokens** (OKLCH CSS variables) drive a minimal Apple/Stripe-inspired theme with light + dark support — no random bright colors.

> **Improvements over the original brief:** added a persisted+rotated refresh-token model (the brief only said "store refresh tokens securely"), httpOnly-cookie delivery, a `status` field + `RestaurantStatus` enum on restaurants (the dashboard needs a real status, not a hardcoded one), centralized tenant-isolation guards, and Zod-validated env config. Each is called out above with its rationale.

---

## 🗂 Data model

```
User 1───* Restaurant         (a user owns many restaurants)
User 1───* RefreshToken       (rotated, hashed, revocable)
```

- **User**: `id, name, email (unique), password (bcrypt), timestamps`
- **Restaurant**: `id, ownerId, name, slug (unique), logo, phone, address, currency, themeColor, description, status, timestamps`
- **RefreshToken**: `id, userId, tokenHash (unique), expiresAt, revokedAt, createdAt`

---

## 🔌 API reference

Base URL: `http://localhost:4000/api/v1`

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | – | Create account, returns user + access token, sets refresh cookie |
| `POST` | `/auth/login` | – | Log in |
| `POST` | `/auth/refresh` | cookie | Rotate refresh token, return new access token |
| `POST` | `/auth/logout` | cookie | Revoke refresh token, clear cookie |
| `GET`  | `/auth/me` | Bearer | Current user profile |

### Restaurants (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/restaurants` | Create a restaurant (auto-generates a unique slug) |
| `GET` | `/restaurants` | List the owner's restaurants |
| `GET` | `/restaurants/:id` | Get one (ownership enforced) |
| `PUT` | `/restaurants/:id` | Update |
| `DELETE` | `/restaurants/:id` | Delete |

Every response uses a consistent envelope:
```json
{ "success": true, "message": "OK", "data": { /* ... */ } }
```

---

## 🚀 Getting started

### Option A — Docker Compose (everything in one command)

```bash
cp .env.example .env          # then edit the JWT secrets
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:4000/api/v1/health
- Postgres → localhost:5432

The backend container runs `prisma migrate deploy` on boot, so the schema is applied automatically.

### Option B — Local development

**1. Database** (Docker is the easy path):
```bash
docker compose up db -d
```

**2. Backend**
```bash
cd backend
cp .env.example .env          # set DATABASE_URL + JWT secrets
npm install
npx prisma migrate dev --name init   # create + apply the first migration
npm run dev                   # http://localhost:4000
```

**3. Frontend**
```bash
cd frontend
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm install
npm run dev                   # http://localhost:3000
```

> First migration: this repo ships the Prisma **schema** but not a committed migration. Run `npx prisma migrate dev --name init` once to generate `prisma/migrations/` against your database.

---

## 📜 Scripts

**Backend**
| Script | Description |
|---|---|
| `npm run dev` | Hot-reloading dev server (tsx) |
| `npm run build` / `start` | Compile to `dist/` / run compiled server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:migrate` / `:deploy` / `:studio` | Prisma helpers |

**Frontend**
| Script | Description |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |

---

## 🗺 Roadmap (built to extend)

- [x] **Phase 1** — Foundation: auth, restaurants, dashboard, landing
- [ ] Phase 2 — Menu management (categories, items, pricing)
- [ ] Phase 3 — QR generation + public menu at `/qr/{slug}`
- [ ] Phase 4 — Ordering & table management
- [ ] Phase 5 — Payments (UPI/cards)
- [ ] Phase 6 — Analytics & multi-location

---

## 📁 Repository layout

```
QRbanao/
├── backend/      Express + TypeScript + Prisma API (clean architecture)
├── frontend/     Next.js 15 + Tailwind + shadcn/ui app
├── docker-compose.yml
├── .env.example
└── README.md
```
