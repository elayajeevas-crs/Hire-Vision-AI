import type { SkillGapRow, StudentProfile } from '@/types';
import { getRoleDefinition } from '@/data/roleSkillMatrix';

function priorityFor(gap: number, weight: number): SkillGapRow['priority'] {
  const score = gap * weight;
  if (score >= 12) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

function actionFor(skill: string, gap: number): string {
  if (gap <= 0) return 'Maintain — consider mentoring others or going deeper.';
  if (gap < 15) return `Sharpen ${skill} with one focused practice project.`;
  if (gap < 35) return `Take a structured course in ${skill} and apply it in a project.`;
  return `Prioritize ${skill} first — start from fundamentals this week.`;
}

export function computeSkillGaps(profile: StudentProfile): SkillGapRow[] {
  const role = getRoleDefinition(profile.targetRole);
  const rows: SkillGapRow[] = role.skills.map((req) => {
    const match = profile.skills.find((s) => s.skill.toLowerCase() === req.skill.toLowerCase());
    const current = match?.proficiency ?? 0;
    const gap = Math.max(0, req.targetProficiency - current);
    return {
      skill: req.skill,
      current,
      target: req.targetProficiency,
      gap,
      priority: priorityFor(gap, req.weight),
      recommendedAction: actionFor(req.skill, gap),
    };
  });

  // Highest priority / largest gap first.
  const priorityRank = { High: 0, Medium: 1, Low: 2 };
  return rows.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || b.gap - a.gap);
}

export function topGapSkills(profile: StudentProfile, count = 3): SkillGapRow[] {
  return computeSkillGaps(profile).slice(0, count);
}
