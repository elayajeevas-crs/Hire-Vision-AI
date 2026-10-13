import { describe, it, expect } from 'vitest';
import { generateFallbackFeedback } from '@/lib/interviewFeedback';
import { getInterviewQuestions } from '@/data/interviewBank';
import { isLiveAIConfigured } from '@/lib/aiService';

describe('generateFallbackFeedback', () => {
  const question = getInterviewQuestions()[0];

  it('gives a higher score for an answer covering key points', () => {
    const goodAnswer = `WHERE filters rows before aggregation, while HAVING filters groups after a GROUP BY has been applied.`;
    const weakAnswer = 'not sure';
    const good = generateFallbackFeedback(question, goodAnswer);
    const weak = generateFallbackFeedback(question, weakAnswer);
    expect(good.score).toBeGreaterThan(weak.score);
  });

  it('always marks itself as a fallback result', () => {
    const feedback = generateFallbackFeedback(question, 'some answer');
    expect(feedback.isFallback).toBe(true);
  });

  it('never throws on an empty answer', () => {
    expect(() => generateFallbackFeedback(question, '')).not.toThrow();
  });
});

describe('isLiveAIConfigured', () => {
  it('reports false when no API key is present (this test environment has none configured)', () => {
    expect(isLiveAIConfigured()).toBe(false);
  });
});
