# Acala Frontend — React SPA

Frontend web application untuk **Acala Bar & Bistro**, dibangun menggunakan **React 19 + TypeScript + Vite + Tailwind CSS**.

## Stack
- **React 19** — UI Framework
- **TypeScript 5** — Type Safety
- **Vite 7** — Bundler & Development Server
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Animations
- **Lucide React** — Icons

## Setup & Running

```bash
# Clone & masuk ke folder
cd acala-frontend

# Install dependencies
npm install

# Development server
npm run dev
# App berjalan di: http://localhost:5173

# Type check
npm run type-check

# Production build
npm run build
```

## Integrasi Backend API

Frontend berkomunikasi dengan backend Laravel via API proxy di Vite (`vite.config.ts`).
Secara default, proxy mengarah ke `http://localhost:8000`.

Jika ingin mengubah URL backend di production/environment lain, atur variabel lingkungan `VITE_BACKEND_URL`:
```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

## Structure
```
src/
├── app.tsx                 ← Entry point React
├── RootApp.tsx             ← Client-side routing
├── components/             ← UI Components (Navbar, Footer, Hero, dll)
├── pages/                  ← Halaman (Home, About, Menu, Gallery, CMS, dll)
├── lib/                    ← CMS API helpers, site data
└── shims/                  ← Helper shims untuk next/image, next/link, next-themes
public/                     ← Static assets (logo, images, favicon)
```
