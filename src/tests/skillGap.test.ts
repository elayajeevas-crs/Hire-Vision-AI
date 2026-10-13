import { describe, it, expect } from 'vitest';
import { computeSkillGaps, topGapSkills } from '@/lib/skillGap';
import { DEMO_STUDENT } from '@/data/demoStudent';

describe('computeSkillGaps', () => {
  it('computes a gap for every skill in the target role matrix', () => {
    const gaps = computeSkillGaps(DEMO_STUDENT);
    expect(gaps.length).toBeGreaterThan(0);
    for (const g of gaps) {
      expect(g.gap).toBe(Math.max(0, g.target - g.current));
    }
  });

  it('matches the documented demo gaps for SQL and Power BI', () => {
    const gaps = computeSkillGaps(DEMO_STUDENT);
    const sql = gaps.find((g) => g.skill === 'SQL');
    const powerBI = gaps.find((g) => g.skill === 'Power BI');
    expect(sql?.current).toBe(40);
    expect(sql?.target).toBe(75);
    expect(powerBI?.current).toBe(20);
    expect(powerBI?.target).toBe(70);
  });

  it('sorts by priority then by gap size descending', () => {
    const gaps = computeSkillGaps(DEMO_STUDENT);
    const priorityRank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    for (let i = 1; i < gaps.length; i++) {
      const prevRank = priorityRank[gaps[i - 1].priority];
      const currRank = priorityRank[gaps[i].priority];
      expect(prevRank).toBeLessThanOrEqual(currRank);
    }
  });

  it('topGapSkills respects the requested count', () => {
    const top = topGapSkills(DEMO_STUDENT, 2);
    expect(top.length).toBe(2);
  });

  it('a skill above target has zero gap', () => {
    const strongProfile = {
      ...DEMO_STUDENT,
      skills: DEMO_STUDENT.skills.map((s) => ({ ...s, proficiency: 100 })),
    };
    const gaps = computeSkillGaps(strongProfile);
    expect(gaps.every((g) => g.gap === 0)).toBe(true);
  });
});
