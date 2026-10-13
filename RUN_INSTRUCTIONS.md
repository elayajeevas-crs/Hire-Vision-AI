# Run Instructions

## 1. Install dependencies

```bash
npm install
```

## 2. (Optional) configure environment

```bash
cp .env.example .env
```

Leave every value blank to run entirely on local demo data with an
offline AI mentor — this is fully supported and is how the hackathon
demo is meant to run.

## 3. Start the dev server

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## 4. Try the demo

- Go to **Login**.
- Click **"Use Demo Mode (Arun Kumar)"**.
- You'll land on the Dashboard with Employability Score = 62/100.
- Explore Skill Gap → Roadmap → AI Mentor → Projects → click **Simulate
  Improvement** on the Dashboard → Placement Dashboard.

## 5. Before shipping / submitting

```bash
npm run typecheck
npm run test
npm run build
```

All three should pass. If you hit an issue, it's most likely a missing
dependency version — re-run `npm install` and try again.

## 6. Preview the production build

```bash
npm run preview
```
