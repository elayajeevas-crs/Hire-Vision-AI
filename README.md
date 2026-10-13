# HireVision AI — Predictive Hiring Intelligence for Students

A hackathon prototype of a career "digital twin" platform: it builds a live
student profile, scores employability with an explainable formula, finds
skill gaps against a target role, generates an 8-week roadmap, and offers
an AI mentor — all runnable with **zero external services required**.

> **Prototype disclaimer:** the Employability Score is an explainable
> heuristic, not a validated hiring-prediction model. Industry Trend data
> is clearly labeled DEMO DATA and is not connected to a live labor-market
> feed. The Recruiter View is a skills/readiness demonstration, never an
> automated hiring decision, and does not use protected characteristics.

## Features

- **Student onboarding** — full profile form (academics, skills, projects, certifications, activities, interests, target role).
- **Career Twin** — a generated digital profile: strengths, gaps, readiness, recommended next skills/projects.
- **Employability Score** — 0–100, explainable weighted formula (weights configurable in one file), with score history, what's helping/hurting, and recommended actions.
- **Skill Gap Analysis** — current vs target proficiency per skill, priority, recommended action.
- **8-week Roadmap** — dynamically generated from the student's real skill gaps; mark tasks complete, expand weeks, see progress.
- **AI Mentor** — chat interface; uses a live OpenAI-compatible API if configured, otherwise a deterministic Offline Mentor grounded in the student's own profile/score/roadmap.
- **Project Recommendations** — ranked by how directly they close the student's current gaps.
- **Industry Trend Monitor** — demo trend dashboard, clearly labeled as demo data.
- **Skill Assessment** — MCQ / coding / scenario questions, skill-wise scoring, revision areas.
- **Interview Preparation** — technical/HR/role-specific questions, AI or rule-based feedback.
- **Placement Dashboard** — cohort readiness, students needing intervention, department/role breakdowns, progress over time.
- **Recruiter View** — candidate cards with skills, projects, readiness, and skill-match percentage (no protected-characteristic ranking).
- **Settings** — edit profile, see AI configuration status, reset local demo data.
- **Demo Mode** — one click loads the "Arun Kumar" profile (Employability Score 62/100) and a **Simulate Improvement** button that steps the score 62 → 70 → 78 as gaps close.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom design tokens, no default template look)
- react-router-dom, recharts, lucide-react
- Vitest for unit tests
- Optional Supabase (Postgres + Auth + RLS) — see `database/schema.sql`
- AI service abstraction supporting any OpenAI-compatible `/chat/completions` endpoint, with a deterministic offline fallback (`src/lib/mentorFallback.ts`, `src/lib/interviewFeedback.ts`) so the app **never** breaks without an API key

## Folder structure

```
hirevision-ai/
├─ database/
│  ├─ schema.sql        # Postgres schema + RLS policies (optional Supabase backend)
│  └─ seed.sql          # Demo data matching src/data/*.ts
├─ src/
│  ├─ components/
│  │  ├─ layout/        # Sidebar, TopNav, DashboardLayout
│  │  ├─ ui/             # Card, Badge, ProgressBar, ScoreRing, Button, etc.
│  │  └─ ProtectedRoute.tsx
│  ├─ context/           # AppStateContext (profile/score/roadmap/mentor state), ToastContext
│  ├─ data/               # Demo data: student, role-skill matrix, trends, projects, assessments, cohorts
│  ├─ lib/                 # scoring.ts, skillGap.ts, roadmap.ts, mentorFallback.ts, interviewFeedback.ts, aiService.ts, storage.ts, supabaseClient.ts, utils.ts
│  ├─ pages/               # One file per route/page (15 pages)
│  ├─ tests/               # Vitest unit tests
│  ├─ types/               # Shared TypeScript domain types
│  ├─ App.tsx, main.tsx, index.css, vite-env.d.ts
├─ .env.example
├─ package.json
├─ tailwind.config.js / postcss.config.js
├─ tsconfig*.json
├─ vite.config.ts
└─ README.md / RUN_INSTRUCTIONS.md
```

## Setup

```bash
npm install
cp .env.example .env   # optional — the app runs fully without editing this
npm run dev
```

The app opens with a Landing page. Click **"Try demo mode"** on the Login
page to instantly load the Arun Kumar profile, or **"Get started"** to fill
out your own onboarding form.

### Environment variables

All optional — see `.env.example`:

| Variable | Purpose | If unset |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Real Postgres persistence via Supabase | App uses `localStorage` (`src/lib/storage.ts`) as a full-featured demo store |
| `VITE_AI_API_KEY` / `VITE_AI_BASE_URL` / `VITE_AI_MODEL` | Live AI Mentor / interview feedback via an OpenAI-compatible endpoint | AI Mentor and Interview Prep automatically use the deterministic Offline Mentor / Offline Coach, clearly labeled in the UI |

### Supabase setup (optional)

1. Create a Supabase project.
2. Run `database/schema.sql` in the SQL editor (creates tables + RLS policies).
3. Run `database/seed.sql` to load demo role-skill matrix / trends / sample assessment questions.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
5. Wire `src/lib/supabaseClient.ts` and page components to read/write Supabase instead of `src/lib/storage.ts` (the integration point is documented inline in that file).

The app **does not require this** — it runs end-to-end on local demo data.

### AI setup (optional)

Set `VITE_AI_API_KEY`, `VITE_AI_BASE_URL` (defaults to OpenAI's endpoint),
and `VITE_AI_MODEL` in `.env`. `src/lib/aiService.ts` calls a standard
`/chat/completions` endpoint and never throws — any failure (missing key,
network error, bad response) transparently falls back to the deterministic
engines so the UI keeps working and labels the response "Offline Mentor" /
"Offline Coach".

### Demo Mode

Login page → **"Use Demo Mode (Arun Kumar)"**. This loads:

- Name: Arun Kumar, B.E Computer Science, 3rd Year, CGPA 8.1, Target Role: Data Analyst
- Skills: Python 70, SQL 40, Power BI 20, Statistics 35, Excel 55, Communication 65
- Projects: Student Expense Tracker, Basic Python Data Analysis
- Certifications: Python Basics
- Employability Score: **62/100**

From the Dashboard, click **"Simulate Improvement"** to bump SQL/Power
BI/Statistics proficiency, tick off roadmap tasks, and step the score
toward 70 then 78 — a labeled simulation, not a real skill change.

## How to run

```bash
npm run dev        # local dev server (Vite)
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
npm run test       # run the Vitest unit test suite once
npm run typecheck  # TypeScript check only
```

## Deployment

The build output (`dist/`) is a static site — deploy it to any static
host:

- **Vercel / Netlify**: point at this repo, build command `npm run build`, output directory `dist`.
- **Static hosting (S3, GitHub Pages, etc.)**: run `npm run build` and upload the contents of `dist/`.
- Set the same environment variables (`VITE_*`) in your hosting provider's dashboard if you want live Supabase/AI instead of the local demo store.

## Hackathon demo flow

1. Open the dashboard (Login → Demo Mode).
2. Show Arun's profile and Employability Score = 62.
3. Open **Skill Gap** — explain the SQL and Power BI gaps.
4. Open **Roadmap** — show the personalized 8-week plan (front-loaded with the biggest gap).
5. Open **AI Mentor** — ask "What should I learn first?" and show the grounded answer.
6. Open **Projects** — show the top recommended project.
7. Back on the Dashboard, click **Simulate Improvement** — watch the score and roadmap progress move.
8. Open **Placement Dashboard** — show how a college could monitor cohort readiness.

## Testing

`src/tests/` covers:

- Employability score calculation (weights sum to 1, deterministic, bounded 0–100, reacts correctly to skill changes)
- Skill gap calculation (matches documented demo gaps, priority sort, zero gap when above target)
- Roadmap generation (always 8 weeks, front-loaded by top gap, weeks 7–8 reserved for portfolio/interview prep, deterministic)
- Offline AI mentor fallback (never throws, grounded in the student's real data)
- Offline interview feedback (keyword-overlap scoring, always labeled as fallback)

Run with `npm run test`.

## Limitations

- **Sandbox note:** this project was authored file-by-file in an offline
  container without npm registry access, so `npm install` / `npm run
  build` / `npm run test` have **not** been executed in that environment.
  The code has been written and reviewed carefully for correctness, but
  you should run the commands above yourself after `npm install` to
  confirm build/test/typecheck pass in your environment before treating
  it as verified.
- Employability scoring is an explainable heuristic, not a validated
  predictive model — do not present it as one.
- Industry trend data is static demo content, not a live feed.
- Local demo store (`localStorage`) is per-browser; it is not a real
  multi-user backend until Supabase is connected.
- Assessment/interview "AI" grading without a configured API key uses
  keyword-overlap heuristics, not true natural-language understanding.
- The role-skill matrix currently covers three demo roles (Data Analyst,
  Frontend Developer, Machine Learning Engineer) — extend
  `src/data/roleSkillMatrix.ts` for more.

## Future enhancements

- Real Supabase persistence + multi-user auth wired end-to-end.
- A production job-market data connector for Industry Trends.
- Resume parsing to auto-fill onboarding.
- Richer, LLM-graded assessment and interview feedback.
- College-admin role management for the Placement Dashboard.
