-- HireVision AI — demo seed data
-- Mirrors the values in src/data/*.ts so a connected Supabase instance
-- shows the same demo content as local Demo Mode.

insert into skills (name) values
  ('Python'), ('SQL'), ('Power BI'), ('Statistics'), ('Excel'),
  ('Communication'), ('Data Cleaning'), ('Data Visualization'),
  ('JavaScript'), ('React'), ('CSS'), ('TypeScript'), ('Git'),
  ('Machine Learning'), ('Deployment/MLOps')
on conflict (name) do nothing;

-- Role-skill matrix: Data Analyst
insert into role_skills (role, domain, skill, target_proficiency, weight) values
  ('Data Analyst', 'Analytics & BI', 'Python', 65, 0.15),
  ('Data Analyst', 'Analytics & BI', 'SQL', 75, 0.20),
  ('Data Analyst', 'Analytics & BI', 'Statistics', 65, 0.15),
  ('Data Analyst', 'Analytics & BI', 'Excel', 70, 0.10),
  ('Data Analyst', 'Analytics & BI', 'Power BI', 70, 0.15),
  ('Data Analyst', 'Analytics & BI', 'Data Cleaning', 65, 0.10),
  ('Data Analyst', 'Analytics & BI', 'Data Visualization', 65, 0.10),
  ('Data Analyst', 'Analytics & BI', 'Communication', 60, 0.05)
on conflict (role, skill) do nothing;

-- Role-skill matrix: Frontend Developer
insert into role_skills (role, domain, skill, target_proficiency, weight) values
  ('Frontend Developer', 'Software Engineering', 'JavaScript', 75, 0.25),
  ('Frontend Developer', 'Software Engineering', 'React', 70, 0.25),
  ('Frontend Developer', 'Software Engineering', 'CSS', 65, 0.15),
  ('Frontend Developer', 'Software Engineering', 'TypeScript', 60, 0.15),
  ('Frontend Developer', 'Software Engineering', 'Git', 60, 0.10),
  ('Frontend Developer', 'Software Engineering', 'Communication', 55, 0.10)
on conflict (role, skill) do nothing;

-- Role-skill matrix: Machine Learning Engineer
insert into role_skills (role, domain, skill, target_proficiency, weight) values
  ('Machine Learning Engineer', 'AI / ML', 'Python', 80, 0.20),
  ('Machine Learning Engineer', 'AI / ML', 'Statistics', 75, 0.15),
  ('Machine Learning Engineer', 'AI / ML', 'Machine Learning', 70, 0.25),
  ('Machine Learning Engineer', 'AI / ML', 'SQL', 60, 0.10),
  ('Machine Learning Engineer', 'AI / ML', 'Data Cleaning', 65, 0.10),
  ('Machine Learning Engineer', 'AI / ML', 'Communication', 55, 0.10),
  ('Machine Learning Engineer', 'AI / ML', 'Deployment/MLOps', 50, 0.10)
on conflict (role, skill) do nothing;

-- Industry trends (demo data)
insert into industry_trends (skill, trend_percent, role_demand, why_it_matters, suggested_action, is_demo_data) values
  ('SQL + Cloud Data Warehousing', 34, 'Rising', 'Most analytics job postings now expect comfort with cloud warehouses, not just local SQL.', 'Practice SQL against a free-tier cloud warehouse sandbox.', true),
  ('Power BI / Modern BI Tools', 28, 'Rising', 'Dashboarding tools remain the most common way analysts communicate findings.', 'Publish one interactive dashboard per month to a portfolio.', true),
  ('Python for Data Analytics', 22, 'Rising', 'pandas-based analysis is increasingly expected alongside SQL.', 'Automate a recurring report using pandas.', true),
  ('Generative AI Literacy', 41, 'Rising', 'Employers expect responsible use of AI copilots to speed up analysis.', 'Learn to verify AI-assisted analysis rather than trusting it blindly.', true),
  ('Manual Reporting (Excel-only)', -12, 'Cooling', 'Fully manual reporting is gradually replaced by BI tools and scripts.', 'Use Excel as a pipeline step, not the final deliverable.', true)
on conflict do nothing;

-- Sample assessment bank (subset)
insert into assessments (role, skill, type, prompt, options, correct_option_index, difficulty) values
  ('Data Analyst', 'SQL', 'mcq', 'Which SQL clause is used to filter rows before grouping?', array['HAVING','WHERE','ORDER BY','GROUP BY'], 1, 'Easy'),
  ('Data Analyst', 'SQL', 'mcq', 'Which clause filters groups after a GROUP BY has been applied?', array['WHERE','HAVING','LIMIT','DISTINCT'], 1, 'Medium'),
  ('Data Analyst', 'Statistics', 'mcq', 'Which measure of central tendency is most affected by extreme outliers?', array['Median','Mode','Mean','Range'], 2, 'Easy');

-- Note: profiles, student_skills, projects, certifications, career_goals,
-- roadmaps, roadmap_items, assessment_results and mentor_messages are all
-- per-user rows created at runtime through the app (or by auth.users
-- sign-up), not seeded here — seeding real user rows would require an
-- auth.users row to satisfy the foreign key.
