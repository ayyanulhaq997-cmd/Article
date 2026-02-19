# Ayyan's Tech Hub

## Overview

Ayyan's Tech Hub is a personal tech writing portfolio and article marketplace built as a single-page application (SPA). It serves as a professional website for a tech content writer specializing in serverless architecture, SaaS, and cloud computing. The application includes:

- **Public-facing pages**: Home, About, Blog, Services, Portfolio, Contact, and legal pages
- **Article marketplace**: Users can browse and purchase tech articles (including PLR articles)
- **Admin dashboard**: Content management for articles and sales tracking
- **AI-powered features**: Article summarization using Google Gemini API
- **Newsletter signup**: Via Formspree integration
- **Cloud database**: Supabase for article storage, sales records, and authentication

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7 using `HashRouter` (hash-based routing for static hosting compatibility)
- **Styling**: Tailwind CSS loaded via CDN (`cdn.tailwindcss.com` in `index.html`), not as a build dependency
- **Icons**: Lucide React for all iconography
- **Build tool**: Vite with React plugin, dev server on port 5000 bound to `0.0.0.0`
- **Fonts**: Inter (body) and JetBrains Mono (monospace) via Google Fonts

### Application Structure
- `/pages/` — Page-level components (HomePage, BlogPage, AdminDashboard, etc.)
- `/components/` — Shared components (Layout with Navbar/Footer, SEO helper, NewsletterSection)
- `/constants.tsx` — Hardcoded article data, services, portfolio items, and intro text
- `/types.ts` — TypeScript interfaces and enums (Article, Service, PortfolioItem, Category enum)
- `/supabaseService.ts` — Supabase client wrapper with database operations (CRUD for articles, sales, auth)
- `/geminiService.ts` — Google Gemini AI integration for article summarization

### Data Layer
- **Primary data source**: Hardcoded articles in `constants.tsx` serve as the baseline content
- **Cloud data source**: Supabase is used for dynamic articles added via admin dashboard
- **Data merging strategy**: Blog page loads both hardcoded and cloud articles, deduplicating by ID (hardcoded takes priority)
- **Supabase tables expected**: `articles` (for article storage), sales tracking table
- **Authentication**: Dual auth system — simple admin key check via `sessionStorage` AND Supabase Auth (email/password)

### State Management
- No external state management library; uses React's built-in `useState` and `useEffect`
- Session persistence for admin login via `sessionStorage` key `ayyan_admin_auth`

### SEO Strategy
- Custom `SEO` component that dynamically updates `document.title`, meta description, keywords, and Open Graph tags
- Google AdSense integration (publisher ID: `ca-pub-7966132303564694`)
- `ads.txt` file present for AdSense verification

### Environment Variables
The Vite config maps these env vars for browser access:
- `GEMINI_API_KEY` → exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`
- `VITE_SUPABASE_URL` → Supabase project URL
- `VITE_SUPABASE_ANON_KEY` → Supabase anonymous/public key

## Recent Changes
- 2026-02-19: Resolved all merge conflicts in `package.json` and `supabaseService.ts`.
- 2026-02-19: Cleaned up temporary backend files and configured Vite for port 5000.
- 2026-02-11: Initial Replit setup.

## External Dependencies

### Third-Party Services
| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase** | Database (articles, sales), Authentication | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` env vars |
| **Google Gemini API** | AI article summarization | `GEMINI_API_KEY` env var, uses `gemini-3-flash-preview` model |
| **Formspree** | Contact form and newsletter submissions | Form ID: `mwvqggqe` |
| **Google AdSense** | Ad monetization | Publisher ID: `ca-pub-7966132303564694` |

### NPM Dependencies (Key)
- `react`, `react-dom` (v19) — UI framework
- `react-router-dom` (v7) — Client-side routing
- `@supabase/supabase-js` — Supabase client
- `@google/genai` — Gemini AI SDK
- `lucide-react` — Icon library

### Deployment
- `vercel.json` present with `cleanUrls: true` suggesting Vercel deployment target
- Vite used as build tool (`npm run build` produces static output)
