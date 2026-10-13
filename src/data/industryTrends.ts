import type { IndustryTrend } from '@/types';

// DEMO DATA — illustrative only. This is NOT connected to a live labor
// market feed. Wire this module up to a real data source (job-board API,
// college placement records, etc.) before treating it as current demand.
export const INDUSTRY_TRENDS: IndustryTrend[] = [
  {
    skill: 'SQL + Cloud Data Warehousing',
    trendPercent: 34,
    roleDemand: 'Rising',
    whyItMatters: 'Most analytics job postings now expect comfort with cloud warehouses (BigQuery, Snowflake, Redshift), not just local SQL.',
    suggestedAction: 'Practice SQL against a free-tier cloud warehouse sandbox instead of only local databases.',
  },
  {
    skill: 'Power BI / Modern BI Tools',
    trendPercent: 28,
    roleDemand: 'Rising',
    whyItMatters: 'Dashboarding tools remain the most common way analysts communicate findings to non-technical stakeholders.',
    suggestedAction: 'Publish one interactive dashboard per month to a portfolio, not just static charts.',
  },
  {
    skill: 'Python for Data Analytics',
    trendPercent: 22,
    roleDemand: 'Rising',
    whyItMatters: 'pandas-based analysis is increasingly expected alongside SQL, especially for automation-heavy roles.',
    suggestedAction: 'Automate a recurring report using pandas instead of doing it manually in a spreadsheet.',
  },
  {
    skill: 'Generative AI Literacy',
    trendPercent: 41,
    roleDemand: 'Rising',
    whyItMatters: 'Employers increasingly expect candidates to responsibly use AI copilots to speed up analysis and documentation.',
    suggestedAction: 'Learn to verify and validate AI-assisted analysis rather than trusting it blindly.',
  },
  {
    skill: 'Manual Reporting (Excel-only)',
    trendPercent: -12,
    roleDemand: 'Cooling',
    whyItMatters: 'Fully manual, non-automated reporting workflows are gradually being replaced by BI tools and scripts.',
    suggestedAction: 'Use Excel as a step in a pipeline rather than the final deliverable.',
  },
];
