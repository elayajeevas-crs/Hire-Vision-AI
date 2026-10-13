import type { AssessmentQuestion } from '@/types';

export const ASSESSMENT_BANK: AssessmentQuestion[] = [
  {
    id: 'q1',
    type: 'mcq',
    skill: 'SQL',
    difficulty: 'Easy',
    prompt: 'Which SQL clause is used to filter rows before grouping?',
    options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'],
    correctOptionIndex: 1,
  },
  {
    id: 'q2',
    type: 'mcq',
    skill: 'SQL',
    difficulty: 'Medium',
    prompt: 'Which clause filters groups after a GROUP BY has been applied?',
    options: ['WHERE', 'HAVING', 'LIMIT', 'DISTINCT'],
    correctOptionIndex: 1,
  },
  {
    id: 'q3',
    type: 'mcq',
    skill: 'Statistics',
    difficulty: 'Easy',
    prompt: 'Which measure of central tendency is most affected by extreme outliers?',
    options: ['Median', 'Mode', 'Mean', 'Range'],
    correctOptionIndex: 2,
  },
  {
    id: 'q4',
    type: 'mcq',
    skill: 'Python',
    difficulty: 'Easy',
    prompt: 'Which pandas method removes rows with missing values?',
    options: ['df.fillna()', 'df.dropna()', 'df.isnull()', 'df.merge()'],
    correctOptionIndex: 1,
  },
  {
    id: 'q5',
    type: 'coding',
    skill: 'SQL',
    difficulty: 'Medium',
    prompt: 'Write a SQL query to find the total sales per region from a table `sales(region, amount)`.',
    sampleAnswer: 'SELECT region, SUM(amount) FROM sales GROUP BY region;',
  },
  {
    id: 'q6',
    type: 'coding',
    skill: 'Python',
    difficulty: 'Medium',
    prompt: 'Write a Python snippet to compute the average of a list of numbers without using a library.',
    sampleAnswer: 'sum(numbers) / len(numbers)',
  },
  {
    id: 'q7',
    type: 'scenario',
    skill: 'Data Cleaning',
    difficulty: 'Medium',
    prompt: 'A dataset has 15% missing values in a numeric "age" column. Describe how you would handle it and why.',
    sampleAnswer: 'impute median or mean, consider missingness pattern, document assumption, avoid dropping too many rows',
  },
  {
    id: 'q8',
    type: 'scenario',
    skill: 'Communication',
    difficulty: 'Easy',
    prompt: 'Your dashboard shows a metric dropped 20% last month. How would you present this to a non-technical stakeholder?',
    sampleAnswer: 'lead with the headline number, explain likely cause, avoid jargon, suggest next step',
  },
  {
    id: 'q9',
    type: 'mcq',
    skill: 'Power BI',
    difficulty: 'Easy',
    prompt: 'In Power BI, what is the primary purpose of a "measure"?',
    options: [
      'To store raw imported data',
      'To perform a calculation dynamically based on filter context',
      'To change the color theme',
      'To connect to a database',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'q10',
    type: 'mcq',
    skill: 'Excel',
    difficulty: 'Easy',
    prompt: 'Which Excel function looks up a value in the first column of a range and returns a value in the same row?',
    options: ['SUMIF', 'VLOOKUP', 'CONCAT', 'COUNTA'],
    correctOptionIndex: 1,
  },
];

export function getQuestionsForRole(): AssessmentQuestion[] {
  // For the demo, return the full bank; a real system would filter by role.
  return ASSESSMENT_BANK;
}
