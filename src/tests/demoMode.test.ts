import { describe, it, expect } from 'vitest';
import { DEMO_STUDENT } from '@/data/demoStudent';
import { computeEmployabilityScore } from '@/lib/scoring';
import { computeSkillGaps } from '@/lib/skillGap';
import { generateRoadmap } from '@/lib/roadmap';

describe('Demo Mode (Arun Kumar)', () => {
  it('matches the documented demo profile basics', () => {
    expect(DEMO_STUDENT.name).toBe('Arun Kumar');
    expect(DEMO_STUDENT.degree).toBe('B.E Computer Science');
    expect(DEMO_STUDENT.yearOfStudy).toBe('3rd Year');
    expect(DEMO_STUDENT.cgpa).toBe(8.1);
    expect(DEMO_STUDENT.targetRole).toBe('Data Analyst');
  });

  it('matches the documented demo skill levels', () => {
    const skill = (name: string) => DEMO_STUDENT.skills.find((s) => s.skill === name)?.proficiency;
    expect(skill('Python')).toBe(70);
    expect(skill('SQL')).toBe(40);
    expect(skill('Power BI')).toBe(20);
    expect(skill('Statistics')).toBe(35);
    expect(skill('Excel')).toBe(55);
    expect(skill('Communication')).toBe(65);
  });

  it('produces a non-trivial skill gap for SQL and Power BI', () => {
    const gaps = computeSkillGaps(DEMO_STUDENT);
    const sql = gaps.find((g) => g.skill === 'SQL')!;
    const powerBI = gaps.find((g) => g.skill === 'Power BI')!;
    expect(sql.gap).toBeGreaterThan(0);
    expect(powerBI.gap).toBeGreaterThan(0);
  });

  it('produces a computable employability score and full 8-week roadmap without errors', () => {
    const score = computeEmployabilityScore(DEMO_STUDENT, 0);
    const roadmap = generateRoadmap(DEMO_STUDENT);
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(roadmap.weeks.length).toBe(8);
  });
});
