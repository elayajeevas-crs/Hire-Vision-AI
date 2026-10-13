import type { PlacementStudentSummary, RecruiterCandidate } from '@/types';

// DEMO DATA — a small illustrative cohort standing in for a placement
// cell's student roster. Arun Kumar (the onboarding demo student) is
// deliberately included so the placement view visibly reflects the
// same student used elsewhere in the demo.
export const PLACEMENT_COHORT: PlacementStudentSummary[] = [
  { id: 'demo-arun-kumar', name: 'Arun Kumar', department: 'Computer Science & Engineering', targetRole: 'Data Analyst', readiness: 62, needsIntervention: false },
  { id: 's2', name: 'Priya Sharma', department: 'Computer Science & Engineering', targetRole: 'Frontend Developer', readiness: 78, needsIntervention: false },
  { id: 's3', name: 'Karthik Raman', department: 'Electronics & Communication', targetRole: 'Data Analyst', readiness: 41, needsIntervention: true },
  { id: 's4', name: 'Divya Menon', department: 'Information Technology', targetRole: 'Machine Learning Engineer', readiness: 55, needsIntervention: false },
  { id: 's5', name: 'Ahmed Rizvi', department: 'Computer Science & Engineering', targetRole: 'Frontend Developer', readiness: 33, needsIntervention: true },
  { id: 's6', name: 'Sneha Iyer', department: 'Information Technology', targetRole: 'Data Analyst', readiness: 69, needsIntervention: false },
  { id: 's7', name: 'Rahul Verma', department: 'Electronics & Communication', targetRole: 'Machine Learning Engineer', readiness: 47, needsIntervention: true },
  { id: 's8', name: 'Meera Nair', department: 'Computer Science & Engineering', targetRole: 'Data Analyst', readiness: 73, needsIntervention: false },
];

export const READINESS_HISTORY = [
  { month: 'Apr', avgReadiness: 48 },
  { month: 'May', avgReadiness: 52 },
  { month: 'Jun', avgReadiness: 55 },
  { month: 'Jul', avgReadiness: 58 },
  { month: 'Aug', avgReadiness: 61 },
  { month: 'Sep', avgReadiness: 63 },
];

export const RECRUITER_CANDIDATES: RecruiterCandidate[] = [
  { id: 'demo-arun-kumar', name: 'Arun Kumar', targetRole: 'Data Analyst', topSkills: ['Python', 'Excel', 'Communication'], projectCount: 2, readiness: 62, matchPercent: 58 },
  { id: 's6', name: 'Sneha Iyer', targetRole: 'Data Analyst', topSkills: ['SQL', 'Power BI', 'Statistics'], projectCount: 3, readiness: 69, matchPercent: 71 },
  { id: 's8', name: 'Meera Nair', targetRole: 'Data Analyst', topSkills: ['SQL', 'Python', 'Data Visualization'], projectCount: 4, readiness: 73, matchPercent: 76 },
  { id: 's2', name: 'Priya Sharma', targetRole: 'Frontend Developer', topSkills: ['React', 'TypeScript', 'CSS'], projectCount: 3, readiness: 78, matchPercent: 80 },
  { id: 's4', name: 'Divya Menon', targetRole: 'Machine Learning Engineer', topSkills: ['Python', 'Statistics', 'Machine Learning'], projectCount: 2, readiness: 55, matchPercent: 52 },
];
