import type { EmployabilityResult, Roadmap, StudentProfile } from '@/types';
import { computeSkillGaps, topGapSkills } from './skillGap';
import { getProjectsForSkills } from '@/data/projectsCatalog';

export interface MentorContext {
  profile: StudentProfile;
  employability: EmployabilityResult;
  roadmap: Roadmap;
}

// Deterministic, rule-based responses used whenever no AI API key is
// configured (see src/lib/aiService.ts). Intentionally simple and
// explainable — every answer is derived directly from the student's
// own profile/gaps/score/roadmap, never invented.
export function generateFallbackMentorReply(question: string, ctx: MentorContext): string {
  const q = question.toLowerCase();
  const gaps = topGapSkills(ctx.profile, 3);
  const gapList = gaps.map((g) => `${g.skill} (${g.current}→${g.target})`).join(', ');

  if (q.includes('learn') && (q.includes('first') || q.includes('week') || q.includes('start'))) {
    const top = gaps[0];
    if (!top) return `Your skills are already close to your ${ctx.profile.targetRole} target — focus on a portfolio project next.`;
    return `Start with ${top.skill}. It's currently your largest gap (${top.current}/100 vs a target of ${top.target}/100) and your roadmap's first week is built around it: "${ctx.roadmap.weeks[0]?.title}". ${top.recommendedAction}`;
  }

  if (q.includes('become') || q.includes('how do i') || q.includes('path')) {
    return `Based on your profile, the path to ${ctx.profile.targetRole || 'your target role'} runs through closing these gaps: ${gapList || 'no major gaps detected'}. Your 8-week roadmap sequences this for you, starting with ${ctx.roadmap.weeks[0]?.title}, and finishes with a portfolio project and interview prep in weeks 7-8.`;
  }

  if (q.includes('interview question') || q.includes('interview')) {
    return `Here's a role-specific question to practice: "Walk me through how you would design a dashboard for a sales team that has never used one before." Structure your answer around stakeholder needs, key metrics, and iteration. Visit Interview Prep for more and to get feedback on your answers.`;
  }

  if (q.includes('project')) {
    const recommended = getProjectsForSkills(gaps.map((g) => g.skill))[0];
    if (!recommended) return 'Explore the Projects page for a full list of recommended builds.';
    return `Try "${recommended.title}" (${recommended.difficulty}, ~${recommended.estimatedDuration}). ${recommended.whyRecommended} It develops: ${recommended.skillsDeveloped.join(', ')}.`;
  }

  if (q.includes('score') && (q.includes('low') || q.includes('why'))) {
    const reasons = ctx.employability.reducing.length > 0 ? ctx.employability.reducing.join(' ') : 'No single category is critically low right now.';
    return `Your Employability Score is ${ctx.employability.score}/100. ${reasons} Recommended next step: ${ctx.employability.recommendedActions[0] ?? 'keep building consistently.'}`;
  }

  if (q.includes('certification') || q.includes('cert')) {
    return `Given your target role (${ctx.profile.targetRole}) and current gaps in ${gapList || 'a few areas'}, a certification most worth your time right now is one that directly covers ${gaps[0]?.skill ?? 'your weakest skill'}.`;
  }

  // Generic fallback grounded in the student's own data.
  return `Here's what I can see from your profile: target role ${ctx.profile.targetRole || 'not set'}, Employability Score ${ctx.employability.score}/100, and your biggest gaps are ${gapList || 'minimal right now'}. Ask me things like "what should I learn this week?" or "why is my score low?" for more specific guidance.`;
}

export function computeReadinessNarrative(profile: StudentProfile): string {
  const gaps = computeSkillGaps(profile);
  const high = gaps.filter((g) => g.priority === 'High').length;
  if (high === 0) return 'No high-priority gaps detected — focus on projects and interview readiness.';
  return `${high} high-priority skill gap${high > 1 ? 's' : ''} detected for ${profile.targetRole || 'your target role'}.`;
}
