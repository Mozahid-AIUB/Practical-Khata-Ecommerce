# Practical Khata — Full-Stack Ecommerce Platform

A production ecommerce platform for **Practical Khata**, a Bangladeshi business selling handwritten SSC/HSC practical notebooks. Built end-to-end — storefront, cart, checkout, and a Laravel/Filament admin backend — and deployed live to real paying customers.

**Live storefront:** [shop.practicalkhata.pro.bd](https://shop.practicalkhata.pro.bd)
**Brand site (existing, SEO-established):** [practicalkhata.pro.bd](https://practicalkhata.pro.bd)
**API:** [practical-khata-ecommerce.onrender.com/api/v1](https://practical-khata-ecommerce.onrender.com/api/v1)

## Real business impact

This isn't a demo — it's running the actual order pipeline for the business:

| Metric | Value |
|---|---|
| Total parcels processed | 36 |
| Delivered | 36 (100%) |
| Revenue processed | ৳32,950 BDT |
| Cancelled | 0 (0%) |

## What it does

- **Bilingual storefront** (Bangla / English) with locale-aware routing, built on Next.js App Router
- **Product catalogue** with category browsing, level (SSC/HSC) and price-range filters, and sorting
- **Cart system** — guest and authenticated carts, persistent across sessions, live slide-in drawer with quantity controls
- **Checkout & order flow** wired to a real Laravel API (not mocked)
- **Admin panel** (Filament) for managing products, categories, orders, and inventory
- **SEO-ready**: sitemap.xml, robots.txt, Open Graph metadata, Search Console verified

## Architecture

```
Frontend (Next.js 16, App Router)  →  Vercel
        │  REST API (JSON, cross-origin cookies)
        ▼
Backend (Laravel 11 + Filament 3)  →  Render (Docker)
        │
        ▼
PostgreSQL + Redis                 →  Render (free tier)
```

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, `next-intl` for i18n
**Backend:** Laravel 11, Filament 3 (admin panel), Sanctum, Eloquent
**Infra:** Docker, Render (API + Postgres + Redis), Vercel (frontend), GitHub Actions-style auto-deploy on push

### Notable engineering decisions

- **Cross-origin cart cookies**: frontend and backend run on different domains (Vercel ↔ Render), so cart session cookies needed `SameSite=None; Secure` instead of the default `Lax` — a subtle bug where every add-to-cart silently created a brand-new cart until this was diagnosed and fixed.
- **Zero-downtime migrations on a shell-less free tier**: Render's free plan has no shell/one-off job access, so database migrations run automatically as part of the container boot sequence (`docker-entrypoint.sh`).
- **Two-domain SEO strategy**: the business's existing site (`practicalkhata.pro.bd`) had established SEO and traffic, so the new storefront was deployed to a subdomain (`shop.practicalkhata.pro.bd`) rather than replacing the live domain — preserving existing search rankings while shipping the new platform.

## Getting started (local dev)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend setup (Docker required):

```bash
cd backend
docker compose up -d
docker compose exec app php artisan migrate --seed
```

Admin panel available at `/admin` once the backend is running.

## Deployment

- **Frontend** deploys automatically to Vercel on every push to `main`.
- **Backend** deploys automatically to Render on every push to `main`; migrations run on container boot.

See [`docs/`](docs/) for the full backend architecture and deployment notes.
