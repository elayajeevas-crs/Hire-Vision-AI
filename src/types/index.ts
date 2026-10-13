// Core domain types for HireVision AI.
// These mirror the Supabase schema in database/schema.sql so the same
// shapes work whether data comes from Postgres or the local demo store.

export interface SkillProficiency {
  skill: string;
  proficiency: number; // 0-100
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  skillsUsed: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  yearOfStudy: string; // e.g. "3rd Year"
  semester: string;
  cgpa: number; // 0-10 scale
  skills: SkillProficiency[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  extracurriculars: string[];
  interests: string[];
  targetRole: string;
  preferredDomain: string;
  communicationScore: number; // 0-100, self-assessed / assessment-derived
  createdAt: string;
}

export interface RoleSkillRequirement {
  skill: string;
  targetProficiency: number; // 0-100
  weight: number; // relative importance within the role, 0-1
}

export interface RoleDefinition {
  role: string;
  domain: string;
  description: string;
  skills: RoleSkillRequirement[];
  emergingSkills: string[];
}

export interface SkillGapRow {
  skill: string;
  current: number;
  target: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  recommendedAction: string;
}

export interface EmployabilityBreakdownItem {
  category: string;
  weight: number; // 0-1
  rawScore: number; // 0-100, category's own score before weighting
  weightedScore: number; // rawScore * weight
}

export interface EmployabilityResult {
  score: number; // 0-100 overall
  previousScore: number;
  change: number;
  breakdown: EmployabilityBreakdownItem[];
  helping: string[];
  reducing: string[];
  recommendedActions: string[];
  computedAt: string;
}

export interface RoadmapMiniTask {
  id: string;
  label: string;
  done: boolean;
}

export interface RoadmapWeek {
  id: string;
  weekLabel: string; // "Week 1-2"
  title: string;
  learningObjective: string;
  targetSkills: string[];
  suggestedResources: string[];
  miniTasks: RoadmapMiniTask[];
  projectMilestone?: string;
  progress: number; // 0-100, derived from miniTasks
  completed: boolean;
}

export interface Roadmap {
  role: string;
  generatedAt: string;
  weeks: RoadmapWeek[];
}

export interface RecommendedProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsDeveloped: string[];
  estimatedDuration: string;
  whyRecommended: string;
  portfolioImpact: string;
}

export interface IndustryTrend {
  skill: string;
  trendPercent: number; // demo indicator, e.g. +34
  roleDemand: 'Rising' | 'Stable' | 'Cooling';
  whyItMatters: string;
  suggestedAction: string;
}

export type AssessmentQuestionType = 'mcq' | 'coding' | 'scenario';

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  skill: string;
  prompt: string;
  options?: string[]; // for mcq
  correctOptionIndex?: number; // for mcq
  sampleAnswer?: string; // for coding/scenario, used by rule-based feedback
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AssessmentResult {
  takenAt: string;
  totalQuestions: number;
  correct: number;
  scorePercent: number;
  skillBreakdown: { skill: string; correct: number; total: number }[];
  revisionAreas: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Role-specific';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  keyPoints: string[]; // used for rule-based feedback matching
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isFallback: boolean;
  createdAt: string;
}

export interface PlacementStudentSummary {
  id: string;
  name: string;
  department: string;
  targetRole: string;
  readiness: number;
  needsIntervention: boolean;
}

export interface RecruiterCandidate {
  id: string;
  name: string;
  targetRole: string;
  topSkills: string[];
  projectCount: number;
  readiness: number;
  matchPercent: number;
}
