import { describe, it, expect } from 'vitest';
import { generateFallbackMentorReply, type MentorContext } from '@/lib/mentorFallback';
import { DEMO_STUDENT } from '@/data/demoStudent';
import { computeEmployabilityScore } from '@/lib/scoring';
import { generateRoadmap } from '@/lib/roadmap';

function buildContext(): MentorContext {
  return {
    profile: DEMO_STUDENT,
    employability: computeEmployabilityScore(DEMO_STUDENT, 0),
    roadmap: generateRoadmap(DEMO_STUDENT),
  };
}

describe('generateFallbackMentorReply', () => {
  it('never throws and always returns non-empty text', () => {
    const ctx = buildContext();
    const questions = [
      'How do I become a Data Analyst?',
      'What should I learn this week?',
      'Give me an interview question.',
      'Suggest a project based on my skills.',
      'Why is my employability score low?',
      'asdkjalksdj random gibberish',
    ];
    for (const q of questions) {
      const reply = generateFallbackMentorReply(q, ctx);
      expect(typeof reply).toBe('string');
      expect(reply.length).toBeGreaterThan(0);
    }
  });

  it('grounds "what should I learn" answers in the actual top skill gap', () => {
    const ctx = buildContext();
    const reply = generateFallbackMentorReply('What should I learn this week?', ctx);
    // The reply should reference one of the student's tracked skills.
    const mentionsKnownSkill = ctx.profile.skills.some((s) => reply.includes(s.skill));
    expect(mentionsKnownSkill).toBe(true);
  });

  it('references the actual employability score when asked why it is low', () => {
    const ctx = buildContext();
    const reply = generateFallbackMentorReply('Why is my score so low?', ctx);
    expect(reply).toContain(String(ctx.employability.score));
  });
});
