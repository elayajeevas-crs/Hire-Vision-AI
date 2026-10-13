import React from 'react';
import { Card, SectionHeading, Badge } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { computeSkillGaps } from '@/lib/skillGap';
import { getProjectsForSkills } from '@/data/projectsCatalog';

export function Projects() {
  const { profile } = useAppState();
  if (!profile) return null;

  const gapSkills = computeSkillGaps(profile).filter((g) => g.gap > 0).map((g) => g.skill);
  const projects = getProjectsForSkills(gapSkills.length > 0 ? gapSkills : profile.skills.map((s) => s.skill));

  return (
    <div>
      <SectionHeading
        title="Recommended Projects"
        description="Ranked by how directly they close your current skill gaps."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">{p.title}</h3>
              <Badge tone={p.difficulty === 'Advanced' ? 'coral' : p.difficulty === 'Intermediate' ? 'amber' : 'teal'}>{p.difficulty}</Badge>
            </div>
            <p className="text-sm text-mist-400">{p.whyRecommended}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.skillsDeveloped.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-mist-400">
              <p><span className="text-mist-300">Duration:</span> {p.estimatedDuration}</p>
            </div>
            <p className="mt-3 border-t border-ink-700 pt-3 text-sm text-mist-300">{p.portfolioImpact}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
