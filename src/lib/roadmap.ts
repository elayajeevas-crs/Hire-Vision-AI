import type { Roadmap, RoadmapWeek, StudentProfile } from '@/types';
import { computeSkillGaps } from './skillGap';

function resourcesFor(skill: string): string[] {
  const generic = [`Official documentation / free course for ${skill}`, `One hands-on practice exercise in ${skill}`];
  const specific: Record<string, string[]> = {
    SQL: ['Mode SQL Tutorial (free)', 'Practice on a sample sales database'],
    'Power BI': ['Microsoft Power BI Learning Path', 'Rebuild one public dashboard from scratch'],
    Statistics: ['Khan Academy: Statistics & Probability', 'Summarize a dataset using mean/median/variance'],
    Excel: ['ExcelJet formula reference', 'Clean a messy sample dataset in Excel'],
    'Data Cleaning': ['pandas data-cleaning cookbook', 'Clean and validate a public messy dataset'],
    'Data Visualization': ['Storytelling with Data (concepts)', 'Recreate 2 charts from a real report'],
    Python: ['Python for Everybody (free)', 'Automate one small repetitive task'],
    Communication: ['Toastmasters-style practice prompts', 'Record a 3-minute project walkthrough'],
  };
  return specific[skill] ?? generic;
}

function miniTaskLabelsFor(skill: string): string[] {
  return [
    `Complete a short ${skill} exercise`,
    `Apply ${skill} to a mini real-world example`,
    `Write 3 notes on what you learned about ${skill}`,
  ];
}

export function generateRoadmap(profile: StudentProfile): Roadmap {
  const gaps = computeSkillGaps(profile).filter((g) => g.gap > 0);
  const orderedSkills = gaps.length > 0 ? gaps.map((g) => g.skill) : ['Portfolio Building', 'Interview Preparation'];

  // Spread the top gap skills across 8 weeks, giving the largest gaps
  // more weeks. Weeks 7-8 are always reserved for a capstone project and
  // resume/interview prep, matching the source project's example plan.
  const skillWeeks: { title: string; skills: string[] }[] = [];
  const primary = orderedSkills.slice(0, 5);

  if (primary[0]) skillWeeks.push({ title: `Deep Dive: ${primary[0]}`, skills: [primary[0]] });
  if (primary[0]) skillWeeks.push({ title: `${primary[0]} — Applied Practice`, skills: [primary[0]] });
  if (primary[1]) skillWeeks.push({ title: `Focus: ${primary[1]}`, skills: [primary[1]] });
  if (primary[2]) skillWeeks.push({ title: `Focus: ${primary[2]}`, skills: [primary[2]] });
  if (primary[3]) skillWeeks.push({ title: `Focus: ${primary[3]}`, skills: [primary[3]] });
  while (skillWeeks.length < 6) {
    skillWeeks.push({ title: 'Reinforce Core Skills', skills: primary.slice(0, 2).length ? primary.slice(0, 2) : ['Portfolio Building'] });
  }

  const weekLabels = ['Week 1-2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
  const weeks: RoadmapWeek[] = [];

  // Weeks 1-6 (first entry spans "Week 1-2")
  for (let i = 0; i < 6; i++) {
    const src = skillWeeks[i] ?? skillWeeks[skillWeeks.length - 1];
    const skill = src.skills[0];
    weeks.push({
      id: `week-${i + 1}`,
      weekLabel: weekLabels[i],
      title: src.title,
      learningObjective: `Raise your ${skill} proficiency and close the gap toward your target role.`,
      targetSkills: src.skills,
      suggestedResources: resourcesFor(skill),
      miniTasks: miniTaskLabelsFor(skill).map((label, idx) => ({
        id: `week-${i + 1}-task-${idx}`,
        label,
        done: false,
      })),
      progress: 0,
      completed: false,
    });
  }

  // Week 7: Portfolio project
  weeks.push({
    id: 'week-7',
    weekLabel: 'Week 7',
    title: 'Portfolio Project',
    learningObjective: 'Combine this month\'s skills into one shippable project for your portfolio.',
    targetSkills: primary.slice(0, 3),
    suggestedResources: ['Pick one project from Project Recommendations', 'Document your process in a README'],
    miniTasks: [
      { id: 'week-7-task-0', label: 'Choose and scope the project', done: false },
      { id: 'week-7-task-1', label: 'Build the core functionality', done: false },
      { id: 'week-7-task-2', label: 'Write a short project write-up', done: false },
    ],
    projectMilestone: 'Ship one complete, demoable project.',
    progress: 0,
    completed: false,
  });

  // Week 8: Resume + interview prep
  weeks.push({
    id: 'week-8',
    weekLabel: 'Week 8',
    title: 'Resume & Interview Preparation',
    learningObjective: 'Package your progress into a strong resume and rehearse interview answers.',
    targetSkills: ['Communication'],
    suggestedResources: ['Update resume with new project and skills', 'Complete 2 mock interviews in Interview Prep'],
    miniTasks: [
      { id: 'week-8-task-0', label: 'Update resume bullet points', done: false },
      { id: 'week-8-task-1', label: 'Complete 2 mock interview questions', done: false },
      { id: 'week-8-task-2', label: 'Review employability score changes', done: false },
    ],
    projectMilestone: 'Resume and interview answers ready to send.',
    progress: 0,
    completed: false,
  });

  return {
    role: profile.targetRole || 'General',
    generatedAt: new Date().toISOString(),
    weeks,
  };
}

export function recalculateWeekProgress(week: RoadmapWeek): RoadmapWeek {
  const done = week.miniTasks.filter((t) => t.done).length;
  const progress = week.miniTasks.length > 0 ? Math.round((done / week.miniTasks.length) * 100) : 0;
  return { ...week, progress, completed: progress === 100 };
}
