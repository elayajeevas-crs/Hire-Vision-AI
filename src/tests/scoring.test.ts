import { describe, it, expect } from 'vitest';
import { computeEmployabilityScore, EMPLOYABILITY_WEIGHTS } from '@/lib/scoring';
import { DEMO_STUDENT } from '@/data/demoStudent';

describe('computeEmployabilityScore', () => {
  it('weights sum to 1', () => {
    const total = Object.values(EMPLOYABILITY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  it('returns a score between 0 and 100', () => {
    const result = computeEmployabilityScore(DEMO_STUDENT, 0);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('is deterministic for the same profile', () => {
    const a = computeEmployabilityScore(DEMO_STUDENT, 0);
    const b = computeEmployabilityScore(DEMO_STUDENT, 0);
    expect(a.score).toBe(b.score);
    expect(a.breakdown).toEqual(b.breakdown);
  });

  it('computes change relative to previous score', () => {
    const result = computeEmployabilityScore(DEMO_STUDENT, 50);
    expect(result.change).toBe(result.score - 50);
  });

  it('increasing a weak skill never decreases the technical skills sub-score', () => {
    const before = computeEmployabilityScore(DEMO_STUDENT, 0);
    const boosted = {
      ...DEMO_STUDENT,
      skills: DEMO_STUDENT.skills.map((s) => (s.skill === 'SQL' ? { ...s, proficiency: 90 } : s)),
    };
    const after = computeEmployabilityScore(boosted, 0);
    const techBefore = before.breakdown.find((b) => b.category === 'Technical Skills')!.rawScore;
    const techAfter = after.breakdown.find((b) => b.category === 'Technical Skills')!.rawScore;
    expect(techAfter).toBeGreaterThanOrEqual(techBefore);
  });

  it('flags low-scoring categories in reducing[]', () => {
    const weakProfile = { ...DEMO_STUDENT, skills: [], projects: [], certifications: [] };
    const result = computeEmployabilityScore(weakProfile, 0);
    expect(result.reducing.length).toBeGreaterThan(0);
  });
});
