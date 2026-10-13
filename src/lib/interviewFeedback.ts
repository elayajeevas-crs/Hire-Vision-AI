import type { InterviewQuestion } from '@/types';

export interface InterviewFeedback {
  score: number; // 0-100
  matchedPoints: string[];
  missedPoints: string[];
  advice: string;
  isFallback: boolean;
}

// Deterministic rule-based feedback: checks how many of a question's
// key discussion points appear in the candidate's answer. This is a
// simple keyword-overlap heuristic, clearly not a substitute for human
// or true AI evaluation — labeled as such in the UI.
export function generateFallbackFeedback(question: InterviewQuestion, answer: string): InterviewFeedback {
  const lower = answer.toLowerCase();
  const matched = question.keyPoints.filter((point) => lower.includes(point.toLowerCase()));
  const missed = question.keyPoints.filter((point) => !matched.includes(point));
  const score = question.keyPoints.length > 0
    ? Math.round((matched.length / question.keyPoints.length) * 100)
    : answer.trim().length > 20 ? 60 : 20;

  let advice: string;
  if (score >= 75) advice = 'Strong answer — you covered most of the key points. Tighten your delivery for interview pacing.';
  else if (score >= 40) advice = `Good start. Try to also mention: ${missed.slice(0, 2).join(', ') || 'more specific detail'}.`;
  else advice = `Consider restructuring your answer to include: ${missed.slice(0, 3).join(', ') || 'more concrete detail and structure'}.`;

  return {
    score,
    matchedPoints: matched,
    missedPoints: missed,
    advice,
    isFallback: true,
  };
}
