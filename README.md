# PAoM Journal Publication Management System

A modern, responsive academic publication management website for the **Philippine Academy of Management (PAoM)**.

## Features

### Public (Visitor / Submitter)
- Landing page with animated statistics
- Journal submission form with tracking codes
- My Submissions lookup
- Publications archive (search, filter, pagination)
- Publication schedule timeline
- Editorial review board
- About page

### Admin (Staff)
- Dashboard with stats, kanban pipeline, charts
- Submissions management
- Reviewer management with workload tracking
- Schedule management (including internal issues)
- Publications masterlist
- Analytics overview
- Settings & integration stubs

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Recharts**
- **React Hook Form** + **Zod**
- **next-themes** (dark/light mode)

## Getting Started (Local Dev)

```bash
cd paom-journal
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin Login (Demo)

- URL: `/admin/login`
- Email: `admin@paom.org`
- Password: `admin123`

## Deploy to GitHub Pages

This project is configured for **static export** — required because GitHub Pages only serves HTML/CSS/JS files (no Node.js server).

### One-time GitHub setup

1. Push this repo to GitHub (e.g. `yourusername/paom-journal`)
2. Go to **Settings → Pages**
3. Under **Build and deployment → Source**, choose **GitHub Actions**
4. Push to `main` (or `master`) — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically

Your site will be live at:

- **Project site:** `https://yourusername.github.io/paom-journal/`
- **User/org site** (repo named `yourusername.github.io`): `https://yourusername.github.io/`

### Test the production build locally

Simulate GitHub Pages with your repo name as the base path:

```bash
NEXT_PUBLIC_BASE_PATH=/paom-journal npm run build
npx serve out
```

Then open `http://localhost:3000/paom-journal/`

### GitHub Pages limitations

| Feature | Status |
|---------|--------|
| All UI pages (public + admin) | Works |
| Dark/light mode | Works |
| Admin login (cookie-based) | Works |
| Form submissions | Saved to browser `localStorage` (demo) |
| API routes (`/api/*`) | Not supported — use Supabase/Firebase client SDK instead |

To connect a real backend on static hosting, call **Supabase** or **Firebase** directly from the browser (see `src/lib/integrations/`).

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Visitor/submitter pages
│   └── admin/
│       ├── login/         # Admin login (no auth guard)
│       └── (protected)/   # Admin pages (auth required)
├── components/
│   ├── ui/                # Shared UI primitives
│   ├── public/            # Public layout components
│   ├── admin/             # Admin layout components
│   ├── dashboard/         # Dashboard widgets
│   ├── forms/             # Form components
│   └── ...
└── lib/
    ├── types.ts           # TypeScript types
    ├── mock-data.ts       # Demo data
    ├── permissions.ts     # Role-based access rules
    └── integrations/      # Supabase & Sheets stubs
```

## Backend Integration

The app is structured for easy backend wiring:

1. **Supabase** — uncomment client in `src/lib/integrations/supabase.ts` (works on GitHub Pages)
2. **Google Sheets** — use Google Apps Script as a webhook (serverless; works on static hosting)
3. Replace `mock-data.ts` imports with client-side API calls

Copy `.env.example` to `.env.local` and add your credentials.

## Brand Colors

| Color | Hex |
|-------|-----|
| Primary Red | `#FF0000` |
| Royal Blue | `#1E22AA` |
| Golden Yellow | `#F4D400` |
| Background | `#F5F5F5` |
| Text | `#1A1A1A` |

## License

Private — Philippine Academy of Management
