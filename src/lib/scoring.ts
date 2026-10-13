import type { EmployabilityBreakdownItem, EmployabilityResult, StudentProfile } from '@/types';
import { getRoleDefinition } from '@/data/roleSkillMatrix';

// ── Configurable weights ────────────────────────────────────────────
// Adjust these to re-tune the Employability Score formula. Weights
// must sum to 1. This is an explainable prototype heuristic, NOT a
// validated hiring-prediction model.
export const EMPLOYABILITY_WEIGHTS = {
  technicalSkills: 0.3,
  projects: 0.2,
  academicPerformance: 0.15,
  certifications: 0.1,
  communication: 0.1,
  industryAlignment: 0.15,
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function scoreTechnicalSkills(profile: StudentProfile): number {
  const role = getRoleDefinition(profile.targetRole);
  if (role.skills.length === 0 || profile.skills.length === 0) return 0;

  let weightedSum = 0;
  let weightTotal = 0;
  for (const req of role.skills) {
    const match = profile.skills.find((s) => s.skill.toLowerCase() === req.skill.toLowerCase());
    const current = match?.proficiency ?? 0;
    const achieved = clamp((current / req.targetProficiency) * 100);
    weightedSum += achieved * req.weight;
    weightTotal += req.weight;
  }
  return weightTotal > 0 ? clamp(weightedSum / weightTotal) : 0;
}

function scoreProjects(profile: StudentProfile): number {
  // Deterministic: each project contributes up to 35 points, capped at 100.
  // A project whose skills overlap the target role's skills counts more.
  const role = getRoleDefinition(profile.targetRole);
  const roleSkills = new Set(role.skills.map((s) => s.skill.toLowerCase()));
  let score = 0;
  for (const project of profile.projects) {
    const overlap = project.skillsUsed.filter((s) => roleSkills.has(s.toLowerCase())).length;
    score += overlap > 0 ? 22 : 12;
  }
  return clamp(score);
}

function scoreAcademics(profile: StudentProfile): number {
  // CGPA is commonly on a 0-10 scale; convert to 0-100.
  return clamp((profile.cgpa / 10) * 100);
}

function scoreCertifications(profile: StudentProfile): number {
  return clamp(profile.certifications.length * 30);
}

function scoreCommunication(profile: StudentProfile): number {
  return clamp(profile.communicationScore);
}

function scoreIndustryAlignment(profile: StudentProfile): number {
  const role = getRoleDefinition(profile.targetRole);
  const studentSkillNames = new Set(profile.skills.map((s) => s.skill.toLowerCase()));
  const emerging = role.emergingSkills;
  if (emerging.length === 0) return 50;
  // Alignment = how many emerging-skill *keywords* the student's interests/skills touch on.
  const interestText = profile.interests.join(' ').toLowerCase();
  let touched = 0;
  for (const skill of emerging) {
    const key = skill.toLowerCase().split(' ')[0];
    if (studentSkillNames.has(skill.toLowerCase()) || interestText.includes(key)) touched += 1;
  }
  const base = (touched / emerging.length) * 60;
  // Domain match bonus
  const domainBonus = profile.preferredDomain && role.domain
    ? (profile.preferredDomain.toLowerCase() === role.domain.toLowerCase() ? 40 : 20)
    : 20;
  return clamp(base + domainBonus);
}

export function computeEmployabilityScore(
  profile: StudentProfile,
  previousScore = 0,
): EmployabilityResult {
  const categories: { key: keyof typeof EMPLOYABILITY_WEIGHTS; label: string; raw: number }[] = [
    { key: 'technicalSkills', label: 'Technical Skills', raw: scoreTechnicalSkills(profile) },
    { key: 'projects', label: 'Projects', raw: scoreProjects(profile) },
    { key: 'academicPerformance', label: 'Academic Performance', raw: scoreAcademics(profile) },
    { key: 'certifications', label: 'Certifications', raw: scoreCertifications(profile) },
    { key: 'communication', label: 'Communication / Interview Readiness', raw: scoreCommunication(profile) },
    { key: 'industryAlignment', label: 'Industry Alignment', raw: scoreIndustryAlignment(profile) },
  ];

  const breakdown: EmployabilityBreakdownItem[] = categories.map((c) => ({
    category: c.label,
    weight: EMPLOYABILITY_WEIGHTS[c.key],
    rawScore: Math.round(c.raw),
    weightedScore: Math.round(c.raw * EMPLOYABILITY_WEIGHTS[c.key]),
  }));

  const total = Math.round(breakdown.reduce((sum, b) => sum + b.weightedScore, 0));

  const helping = breakdown
    .filter((b) => b.rawScore >= 60)
    .sort((a, b) => b.rawScore - a.rawScore)
    .map((b) => `${b.category} (${b.rawScore}/100) is pulling your score up.`);

  const reducing = breakdown
    .filter((b) => b.rawScore < 50)
    .sort((a, b) => a.rawScore - b.rawScore)
    .map((b) => `${b.category} (${b.rawScore}/100) is holding your score back.`);

  const recommendedActions: string[] = [];
  const weakest = [...breakdown].sort((a, b) => a.rawScore - b.rawScore).slice(0, 3);
  for (const w of weakest) {
    if (w.category === 'Technical Skills') recommendedActions.push('Close your top 2-3 skill gaps for your target role (see Skill Gap Analysis).');
    if (w.category === 'Projects') recommendedActions.push('Ship one more project that uses your target role\'s core tools.');
    if (w.category === 'Certifications') recommendedActions.push('Complete one relevant certification aligned with your target role.');
    if (w.category === 'Communication / Interview Readiness') recommendedActions.push('Practice mock interviews in Interview Prep to build communication confidence.');
    if (w.category === 'Industry Alignment') recommendedActions.push('Explore an emerging skill from the Industry Trends page relevant to your role.');
    if (w.category === 'Academic Performance') recommendedActions.push('Keep academic performance steady while prioritizing applied skill-building.');
  }

  return {
    score: total,
    previousScore,
    change: total - previousScore,
    breakdown,
    helping: helping.length > 0 ? helping : ['Keep building — no category is a standout strength yet.'],
    reducing,
    recommendedActions: [...new Set(recommendedActions)].slice(0, 4),
    computedAt: new Date().toISOString(),
  };
}
