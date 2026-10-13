import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Map, MessageCircle, TrendingUp, Building2, Users, GraduationCap } from 'lucide-react';
import { Card, Button } from '@/components/ui/Primitives';

const FEATURES = [
  { icon: Target, title: 'Skill Gap Analysis', copy: 'Compares your current skills against a real target role and shows exactly what to close first.' },
  { icon: Map, title: 'Semester Roadmaps', copy: 'An 8-week plan generated from your own gaps, not a generic checklist.' },
  { icon: MessageCircle, title: 'AI Mentor', copy: 'Ask career questions and get answers grounded in your profile, score, and roadmap.' },
  { icon: TrendingUp, title: 'Industry Trend Monitor', copy: 'See which skills are rising or cooling, clearly labeled as demo or live data.' },
];

const VALUE_ROWS = [
  { icon: GraduationCap, title: 'For Students', copy: 'A clear, explainable readiness score and a plan you can actually follow week by week.' },
  { icon: Building2, title: 'For Colleges', copy: 'A placement dashboard showing cohort readiness and who needs intervention, at a glance.' },
  { icon: Users, title: 'For Recruiters', copy: 'A skills-and-readiness view of candidates — never a black-box hiring decision.' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-ink-950 text-mist-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-signal-amber/90" />
          <span className="font-display text-lg font-semibold">HireVision AI</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-mist-300 hover:text-mist-100">Log in</Link>
          <Link to="/onboarding">
            <Button>Get started</Button>
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="mb-4 text-sm font-medium text-signal-amber">Prototype · Hackathon build</p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            A career digital twin that actually tracks your skills, not just your resume.
          </h1>
          <p className="mt-5 max-w-lg text-mist-400">
            Generic career guidance doesn't adapt to your skills or to how fast requirements change.
            HireVision AI builds a living profile from your academics, projects, and interests, then
            shows a readiness score, the exact gaps standing between you and a target role, and a
            week-by-week plan to close them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/onboarding">
              <Button>
                Build my career twin <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Try demo mode</Button>
            </Link>
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <p className="mb-2 text-xs uppercase tracking-wide text-mist-400">Employability Score</p>
          <div className="flex items-end gap-4">
            <span className="font-display text-6xl font-semibold text-signal-amber">62</span>
            <span className="pb-2 text-sm text-mist-400">/ 100 · prototype readiness indicator</span>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: 'SQL', current: 40, target: 75 },
              { label: 'Power BI', current: 20, target: 70 },
              { label: 'Statistics', current: 35, target: 65 },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-xs text-mist-400">
                  <span>{row.label}</span>
                  <span>{row.current} → {row.target}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-700">
                  <div className="h-full rounded-full bg-signal-amber" style={{ width: `${row.current}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-2xl font-semibold">How it works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <f.icon className="text-signal-teal" size={22} />
              <h3 className="mt-3 font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-mist-400">{f.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-2xl font-semibold">Built for three audiences</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {VALUE_ROWS.map((v) => (
            <Card key={v.title}>
              <v.icon className="text-signal-amber" size={22} />
              <h3 className="mt-3 font-display text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-mist-400">{v.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Card className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold">See it end to end in under two minutes</h3>
            <p className="mt-1 text-sm text-mist-400">Load the built-in demo profile and walk through the full flow — no signup required.</p>
          </div>
          <Link to="/login">
            <Button>
              Try demo mode <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>
        <p className="mt-6 text-xs text-mist-400">
          This is a hackathon prototype. Employability scores are an explainable heuristic, not a validated
          hiring prediction. Industry trend data is clearly labeled demo data unless a live source is connected.
        </p>
      </section>
    </div>
  );
}
