import type { InterviewQuestion } from '@/types';

export const INTERVIEW_BANK: InterviewQuestion[] = [
  {
    id: 'i1',
    category: 'Technical',
    difficulty: 'Easy',
    question: 'What is the difference between WHERE and HAVING in SQL?',
    keyPoints: ['where filters rows', 'having filters groups', 'aggregate', 'group by'],
  },
  {
    id: 'i2',
    category: 'Technical',
    difficulty: 'Medium',
    question: 'How would you detect and handle outliers in a numeric dataset?',
    keyPoints: ['iqr', 'z-score', 'boxplot', 'domain knowledge', 'context'],
  },
  {
    id: 'i3',
    category: 'Role-specific',
    difficulty: 'Medium',
    question: 'Walk me through how you would design a dashboard for a sales team that has never used one before.',
    keyPoints: ['stakeholder needs', 'key metrics', 'simplicity', 'iteration', 'training'],
  },
  {
    id: 'i4',
    category: 'HR',
    difficulty: 'Easy',
    question: 'Tell me about a time you had to learn a new tool quickly for a project.',
    keyPoints: ['specific example', 'learning approach', 'outcome', 'what you learned'],
  },
  {
    id: 'i5',
    category: 'HR',
    difficulty: 'Easy',
    question: 'Why are you interested in a Data Analyst role specifically?',
    keyPoints: ['motivation', 'relevant experience', 'career goal', 'specific interest'],
  },
  {
    id: 'i6',
    category: 'Role-specific',
    difficulty: 'Hard',
    question: 'A stakeholder disagrees with your analysis and insists their gut feeling is correct. How do you respond?',
    keyPoints: ['listen', 'evidence', 'respectful', 'validate data', 'collaborate'],
  },
];

export function getInterviewQuestions(): InterviewQuestion[] {
  return INTERVIEW_BANK;
}
