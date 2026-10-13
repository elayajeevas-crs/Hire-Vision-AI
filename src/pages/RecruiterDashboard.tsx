import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card, SectionHeading, Badge, ProgressBar } from '@/components/ui/Primitives';
import { RECRUITER_CANDIDATES } from '@/data/cohortDemoData';

export function RecruiterDashboard() {
  return (
    <div>
      <SectionHeading
        title="Recruiter View"
        description="A skills-and-readiness snapshot of candidates. This is a demonstration, not an automated hiring decision."
      />

      <div className="mb-5 flex items-start gap-2 rounded-lg border border-signal-amber/30 bg-signal-amber/5 px-4 py-3 text-sm text-signal-amber">
        <ShieldAlert size={16} className="mt-0.5 shrink-0" />
        <p>This prototype never ranks candidates using protected characteristics. Match percentage reflects skills and readiness only, and should support — not replace — human judgment.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {RECRUITER_CANDIDATES.map((c) => (
          <Card key={c.id}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">{c.name}</h3>
              <Badge tone="amber">{c.targetRole}</Badge>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {c.topSkills.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
            <p className="text-sm text-mist-400">{c.projectCount} portfolio project{c.projectCount !== 1 ? 's' : ''}</p>

            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-mist-400">
                <span>Readiness</span>
                <span>{c.readiness}/100</span>
              </div>
              <ProgressBar value={c.readiness} tone="teal" />
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-mist-400">
                <span>Skill match to role</span>
                <span>{c.matchPercent}%</span>
              </div>
              <ProgressBar value={c.matchPercent} tone="amber" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
