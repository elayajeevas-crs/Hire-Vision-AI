import type { RoleDefinition } from '@/types';

// DEMO DATA — a small, illustrative role-skill matrix. In a production
// system this would be sourced from labor-market data providers or a
// college's placement records, refreshed on a schedule.
export const ROLE_SKILL_MATRIX: RoleDefinition[] = [
  {
    role: 'Data Analyst',
    domain: 'Analytics & BI',
    description: 'Turns raw data into decisions using SQL, statistics and visualization tools.',
    skills: [
      { skill: 'Python', targetProficiency: 65, weight: 0.15 },
      { skill: 'SQL', targetProficiency: 75, weight: 0.2 },
      { skill: 'Statistics', targetProficiency: 65, weight: 0.15 },
      { skill: 'Excel', targetProficiency: 70, weight: 0.1 },
      { skill: 'Power BI', targetProficiency: 70, weight: 0.15 },
      { skill: 'Data Cleaning', targetProficiency: 65, weight: 0.1 },
      { skill: 'Data Visualization', targetProficiency: 65, weight: 0.1 },
      { skill: 'Communication', targetProficiency: 60, weight: 0.05 },
    ],
    emergingSkills: ['dbt', 'Looker Studio', 'Python for Analytics (pandas/polars)'],
  },
  {
    role: 'Frontend Developer',
    domain: 'Software Engineering',
    description: 'Builds user-facing web interfaces with modern JavaScript frameworks.',
    skills: [
      { skill: 'JavaScript', targetProficiency: 75, weight: 0.25 },
      { skill: 'React', targetProficiency: 70, weight: 0.25 },
      { skill: 'CSS', targetProficiency: 65, weight: 0.15 },
      { skill: 'TypeScript', targetProficiency: 60, weight: 0.15 },
      { skill: 'Git', targetProficiency: 60, weight: 0.1 },
      { skill: 'Communication', targetProficiency: 55, weight: 0.1 },
    ],
    emergingSkills: ['Server Components', 'Edge Rendering', 'Design Systems Tooling'],
  },
  {
    role: 'Machine Learning Engineer',
    domain: 'AI / ML',
    description: 'Builds and deploys predictive models and ML-powered systems.',
    skills: [
      { skill: 'Python', targetProficiency: 80, weight: 0.2 },
      { skill: 'Statistics', targetProficiency: 75, weight: 0.15 },
      { skill: 'Machine Learning', targetProficiency: 70, weight: 0.25 },
      { skill: 'SQL', targetProficiency: 60, weight: 0.1 },
      { skill: 'Data Cleaning', targetProficiency: 65, weight: 0.1 },
      { skill: 'Communication', targetProficiency: 55, weight: 0.1 },
      { skill: 'Deployment/MLOps', targetProficiency: 50, weight: 0.1 },
    ],
    emergingSkills: ['LLM Fine-tuning', 'Vector Databases', 'MLOps Pipelines'],
  },
];

export function getRoleDefinition(role: string): RoleDefinition {
  const match = ROLE_SKILL_MATRIX.find((r) => r.role.toLowerCase() === role.toLowerCase());
  return match ?? ROLE_SKILL_MATRIX[0];
}

export function listRoleNames(): string[] {
  return ROLE_SKILL_MATRIX.map((r) => r.role);
}
