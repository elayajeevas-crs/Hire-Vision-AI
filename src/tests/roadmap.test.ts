import { describe, it, expect } from 'vitest';
import { generateRoadmap, recalculateWeekProgress } from '@/lib/roadmap';
import { computeSkillGaps } from '@/lib/skillGap';
import { DEMO_STUDENT } from '@/data/demoStudent';

describe('generateRoadmap', () => {
  it('always generates exactly 8 weeks', () => {
    const roadmap = generateRoadmap(DEMO_STUDENT);
    expect(roadmap.weeks.length).toBe(8);
  });

  it('reserves week 7 for a portfolio project and week 8 for interview prep', () => {
    const roadmap = generateRoadmap(DEMO_STUDENT);
    expect(roadmap.weeks[6].title).toMatch(/Portfolio/i);
    expect(roadmap.weeks[7].title).toMatch(/Resume|Interview/i);
    expect(roadmap.weeks[6].projectMilestone).toBeTruthy();
  });

  it('front-loads the roadmap with the top-priority skill gap', () => {
    const roadmap = generateRoadmap(DEMO_STUDENT);
    const gaps = computeSkillGaps(DEMO_STUDENT).filter((g) => g.gap > 0);
    expect(roadmap.weeks[0].targetSkills).toContain(gaps[0].skill);
  });

  it('every week starts with zero progress and is not completed', () => {
    const roadmap = generateRoadmap(DEMO_STUDENT);
    for (const week of roadmap.weeks) {
      expect(week.progress).toBe(0);
      expect(week.completed).toBe(false);
    }
  });

  it('recalculateWeekProgress reflects completed mini tasks', () => {
    const roadmap = generateRoadmap(DEMO_STUDENT);
    const week = roadmap.weeks[0];
    const allDone = { ...week, miniTasks: week.miniTasks.map((t) => ({ ...t, done: true })) };
    const recalculated = recalculateWeekProgress(allDone);
    expect(recalculated.progress).toBe(100);
    expect(recalculated.completed).toBe(true);
  });

  it('is deterministic for the same profile', () => {
    const a = generateRoadmap(DEMO_STUDENT);
    const b = generateRoadmap(DEMO_STUDENT);
    expect(a.weeks.map((w) => w.title)).toEqual(b.weeks.map((w) => w.title));
  });
});
