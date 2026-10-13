import React from 'react';
import { Card, SectionHeading, ProgressBar, Badge } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { computeSkillGaps } from '@/lib/skillGap';
import { getRoleDefinition } from '@/data/roleSkillMatrix';

export function CareerTwin() {
  const { profile, latestEmployability } = useAppState();
  if (!profile || !latestEmployability) return null;

  const role = getRoleDefinition(profile.targetRole);
  const gaps = computeSkillGaps(profile);
  const strengths = [...profile.skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 3);
  const nextSkills = gaps.filter((g) => g.gap > 0).slice(0, 3);

  return (
    <div>
      <SectionHeading
        title="Your Career Twin"
        description={`A live digital representation of your profile, tracked against the ${role.role} role.`}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-mist-400">Target role</p>
          <p className="mt-1 font-display text-lg font-semibold">{profile.targetRole || 'Not set'}</p>
          <p className="mt-1 text-sm text-mist-400">{role.description}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-mist-400">Readiness score</p>
          <p className="mt-1 font-display text-lg font-semibold">{latestEmployability.score} / 100</p>
          <p className="mt-1 text-sm text-mist-400">Prototype readiness indicator, not a hiring guarantee.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-mist-400">Academic snapshot</p>
          <p className="mt-1 font-display text-lg font-semibold">{profile.cgpa.toFixed(1)} CGPA</p>
          <p className="mt-1 text-sm text-mist-400">{profile.degree} · {profile.yearOfStudy}</p>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Strengths</h3>
          <div className="flex flex-col gap-3">
            {strengths.map((s) => (
              <div key={s.skill}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-mist-100">{s.skill}</span>
                  <span className="text-mist-400">{s.proficiency}/100</span>
                </div>
                <ProgressBar value={s.proficiency} tone="teal" />
              </div>
            ))}
            {strengths.length === 0 && <p className="text-sm text-mist-400">Add skills in Settings to see your strengths here.</p>}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Recommended next skills</h3>
          <div className="flex flex-col gap-3">
            {nextSkills.map((g) => (
              <div key={g.skill} className="flex items-center justify-between rounded-lg border border-ink-700 px-3 py-2">
                <div>
                  <p className="text-sm text-mist-100">{g.skill}</p>
                  <p className="text-xs text-mist-400">{g.recommendedAction}</p>
                </div>
                <Badge tone={g.priority === 'High' ? 'coral' : 'amber'}>{g.priority}</Badge>
              </div>
            ))}
            {nextSkills.length === 0 && <p className="text-sm text-mist-400">You're at or above target on all tracked skills.</p>}
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h3 className="mb-3 font-display text-base font-semibold">Recommended projects</h3>
        <p className="text-sm text-mist-400">Projects that would close your remaining gaps are on the Projects page — they update automatically as your skills change.</p>
      </Card>
    </div>
  );
}
