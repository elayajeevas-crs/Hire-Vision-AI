import type { RecommendedProject } from '@/types';

// DEMO DATA — a small illustrative catalog. Each project lists the
// skills it primarily develops so recommendations can be matched
// against a student's current skill gaps.
export const PROJECT_CATALOG: RecommendedProject[] = [
  {
    id: 'p-sales-dashboard',
    title: 'Sales Analytics Dashboard',
    difficulty: 'Intermediate',
    skillsDeveloped: ['SQL', 'Power BI', 'Data Cleaning', 'Data Visualization'],
    estimatedDuration: '2 weeks',
    whyRecommended: 'Directly targets your biggest gaps in SQL and Power BI using a realistic business scenario.',
    portfolioImpact: 'Shows recruiters you can go from messy raw data to a decision-ready dashboard.',
  },
  {
    id: 'p-survey-stats',
    title: 'Student Survey Statistical Report',
    difficulty: 'Beginner',
    skillsDeveloped: ['Statistics', 'Excel', 'Data Cleaning'],
    estimatedDuration: '1 week',
    whyRecommended: 'Builds core statistics fluency (mean, distribution, correlation) using data you can collect yourself.',
    portfolioImpact: 'Demonstrates you can reason about data quality and draw defensible conclusions.',
  },
  {
    id: 'p-attendance-etl',
    title: 'Automated Attendance ETL Pipeline',
    difficulty: 'Intermediate',
    skillsDeveloped: ['Python', 'SQL', 'Data Cleaning'],
    estimatedDuration: '2 weeks',
    whyRecommended: 'Combines Python and SQL to automate a real, recognizable workflow end to end.',
    portfolioImpact: 'Signals automation thinking, a trait recruiters look for beyond one-off analysis.',
  },
  {
    id: 'p-portfolio-site',
    title: 'Personal Data Portfolio Website',
    difficulty: 'Beginner',
    skillsDeveloped: ['Communication', 'Data Visualization'],
    estimatedDuration: '1 week',
    whyRecommended: 'Gives you one place to present all other projects clearly to recruiters and placement cells.',
    portfolioImpact: 'Often the deciding factor in first-round shortlisting — a clear presentation of existing work.',
  },
  {
    id: 'p-churn-model',
    title: 'Customer Churn Prediction (Intro ML)',
    difficulty: 'Advanced',
    skillsDeveloped: ['Python', 'Statistics', 'Machine Learning'],
    estimatedDuration: '3 weeks',
    whyRecommended: 'A natural next step once core analytics skills are solid, bridging into predictive modeling.',
    portfolioImpact: 'Differentiates a candidate aiming at analytics-to-ML career growth.',
  },
];

export function getProjectsForSkills(skills: string[]): RecommendedProject[] {
  const lowerSkills = skills.map((s) => s.toLowerCase());
  const scored = PROJECT_CATALOG.map((project) => {
    const overlap = project.skillsDeveloped.filter((s) => lowerSkills.includes(s.toLowerCase())).length;
    return { project, overlap };
  });
  return scored
    .sort((a, b) => b.overlap - a.overlap)
    .map((s) => s.project);
}
