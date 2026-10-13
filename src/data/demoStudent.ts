import type { StudentProfile } from '@/types';

// This is the canonical "Arun Kumar" demo profile used throughout the
// judge demo flow. All values are illustrative prototype data, not real
// records of any person.
export const DEMO_STUDENT: StudentProfile = {
  id: 'demo-arun-kumar',
  name: 'Arun Kumar',
  email: 'arun.kumar@example.edu',
  college: 'Sample Institute of Technology',
  degree: 'B.E Computer Science',
  department: 'Computer Science & Engineering',
  yearOfStudy: '3rd Year',
  semester: '5th Semester',
  cgpa: 8.1,
  skills: [
    { skill: 'Python', proficiency: 70 },
    { skill: 'SQL', proficiency: 40 },
    { skill: 'Power BI', proficiency: 20 },
    { skill: 'Statistics', proficiency: 35 },
    { skill: 'Excel', proficiency: 55 },
    { skill: 'Communication', proficiency: 65 },
    { skill: 'Data Cleaning', proficiency: 30 },
    { skill: 'Data Visualization', proficiency: 25 },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Student Expense Tracker',
      description: 'A desktop app to log and categorize personal expenses with monthly summaries.',
      skillsUsed: ['Python', 'Data Cleaning'],
    },
    {
      id: 'proj-2',
      title: 'Basic Python Data Analysis',
      description: 'Exploratory analysis of a public dataset using pandas and matplotlib.',
      skillsUsed: ['Python', 'Statistics', 'Data Visualization'],
    },
  ],
  certifications: [{ id: 'cert-1', name: 'Python Basics', issuer: 'Demo Certification Provider' }],
  extracurriculars: ['Coding Club Member', 'College Tech Fest Volunteer'],
  interests: ['Data Analytics', 'Business Intelligence', 'Machine Learning basics'],
  targetRole: 'Data Analyst',
  preferredDomain: 'Analytics & BI',
  communicationScore: 65,
  createdAt: new Date().toISOString(),
};

// A blank profile shape used to seed the onboarding form.
export function createBlankProfile(): StudentProfile {
  return {
    id: `student-${Date.now()}`,
    name: '',
    email: '',
    college: '',
    degree: '',
    department: '',
    yearOfStudy: '',
    semester: '',
    cgpa: 0,
    skills: [],
    projects: [],
    certifications: [],
    extracurriculars: [],
    interests: [],
    targetRole: '',
    preferredDomain: '',
    communicationScore: 50,
    createdAt: new Date().toISOString(),
  };
}
