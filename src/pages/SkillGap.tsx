import React from 'react';
import { Card, SectionHeading, ProgressBar, Badge } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { computeSkillGaps } from '@/lib/skillGap';

export function SkillGap() {
  const { profile } = useAppState();
  if (!profile) return null;
  const rows = computeSkillGaps(profile);

  return (
    <div>
      <SectionHeading
        title="Skill Gap Analysis"
        description={`Current proficiency vs the target profile for ${profile.targetRole || 'your role'}.`}
      />
      <Card>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-xs uppercase tracking-wide text-mist-400">
                <th className="py-2 pr-4">Skill</th>
                <th className="py-2 pr-4">Current</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Gap</th>
                <th className="py-2 pr-4">Priority</th>
                <th className="py-2">Recommended action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.skill} className="border-b border-ink-800">
                  <td className="py-3 pr-4 font-medium text-mist-100">{row.skill}</td>
                  <td className="py-3 pr-4 w-32">
                    <div className="flex items-center gap-2">
                      <div className="w-16"><ProgressBar value={row.current} tone="teal" /></div>
                      <span className="text-xs text-mist-400">{row.current}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 w-32">
                    <div className="flex items-center gap-2">
                      <div className="w-16"><ProgressBar value={row.target} tone="amber" /></div>
                      <span className="text-xs text-mist-400">{row.target}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-mist-300">{row.gap}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={row.priority === 'High' ? 'coral' : row.priority === 'Medium' ? 'amber' : 'teal'}>{row.priority}</Badge>
                  </td>
                  <td className="py-3 text-mist-400">{row.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="mt-4 text-sm text-mist-400">No role skill matrix found for this target role.</p>}
      </Card>
    </div>
  );
}
