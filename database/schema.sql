-- HireVision AI — Supabase schema
-- This schema is provided so the prototype has a clear integration path
-- to real persistence. The shipped frontend runs fully on local demo
-- data (see src/lib/storage.ts) and does NOT require this schema to
-- function. Apply this only if you choose to connect Supabase.

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── profiles ─────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  college text,
  degree text,
  department text,
  year_of_study text,
  semester text,
  cgpa numeric(4,2) check (cgpa >= 0 and cgpa <= 10),
  preferred_domain text,
  communication_score int default 50 check (communication_score between 0 and 100),
  created_at timestamptz not null default now()
);
create index if not exists idx_profiles_user_id on profiles(user_id);

-- ── skills (catalog) ─────────────────────────────────────────────────
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- ── student_skills ───────────────────────────────────────────────────
create table if not exists student_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  proficiency int not null check (proficiency between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (profile_id, skill_id)
);
create index if not exists idx_student_skills_profile on student_skills(profile_id);

-- ── projects ─────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  skills_used text[] default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_projects_profile on projects(profile_id);

-- ── certifications ───────────────────────────────────────────────────
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name text not null,
  issuer text,
  created_at timestamptz not null default now()
);
create index if not exists idx_certifications_profile on certifications(profile_id);

-- ── career_goals ─────────────────────────────────────────────────────
create table if not exists career_goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  target_role text not null,
  interests text[] default '{}',
  extracurriculars text[] default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_career_goals_profile on career_goals(profile_id);

-- ── role_skills (demo role-skill matrix) ────────────────────────────
create table if not exists role_skills (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  domain text,
  skill text not null,
  target_proficiency int not null check (target_proficiency between 0 and 100),
  weight numeric(4,3) not null,
  unique (role, skill)
);

-- ── roadmaps ─────────────────────────────────────────────────────────
create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  role text not null,
  generated_at timestamptz not null default now()
);
create index if not exists idx_roadmaps_profile on roadmaps(profile_id);

-- ── roadmap_items (weeks) ───────────────────────────────────────────
create table if not exists roadmap_items (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid references roadmaps(id) on delete cascade,
  week_label text not null,
  title text not null,
  learning_objective text,
  target_skills text[] default '{}',
  suggested_resources text[] default '{}',
  project_milestone text,
  progress int default 0 check (progress between 0 and 100),
  completed boolean default false,
  sort_order int not null
);
create index if not exists idx_roadmap_items_roadmap on roadmap_items(roadmap_id);

-- ── assessments ──────────────────────────────────────────────────────
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  role text,
  skill text not null,
  type text not null check (type in ('mcq', 'coding', 'scenario')),
  prompt text not null,
  options text[],
  correct_option_index int,
  sample_answer text,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard'))
);

-- ── assessment_results ───────────────────────────────────────────────
create table if not exists assessment_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  taken_at timestamptz not null default now(),
  total_questions int not null,
  correct int not null,
  score_percent int not null,
  skill_breakdown jsonb not null default '[]',
  revision_areas text[] default '{}'
);
create index if not exists idx_assessment_results_profile on assessment_results(profile_id);

-- ── mentor_messages ──────────────────────────────────────────────────
create table if not exists mentor_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  is_fallback boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_mentor_messages_profile on mentor_messages(profile_id);

-- ── industry_trends ──────────────────────────────────────────────────
create table if not exists industry_trends (
  id uuid primary key default gen_random_uuid(),
  skill text not null,
  trend_percent numeric(5,2) not null,
  role_demand text check (role_demand in ('Rising', 'Stable', 'Cooling')),
  why_it_matters text,
  suggested_action text,
  is_demo_data boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────
alter table profiles enable row level security;
alter table student_skills enable row level security;
alter table projects enable row level security;
alter table certifications enable row level security;
alter table career_goals enable row level security;
alter table roadmaps enable row level security;
alter table roadmap_items enable row level security;
alter table assessment_results enable row level security;
alter table mentor_messages enable row level security;

-- Students can only see and modify their own rows.
create policy "Profiles: owner read" on profiles for select using (auth.uid() = user_id);
create policy "Profiles: owner write" on profiles for insert with check (auth.uid() = user_id);
create policy "Profiles: owner update" on profiles for update using (auth.uid() = user_id);

create policy "Student skills: owner all" on student_skills for all
  using (exists (select 1 from profiles p where p.id = student_skills.profile_id and p.user_id = auth.uid()));

create policy "Projects: owner all" on projects for all
  using (exists (select 1 from profiles p where p.id = projects.profile_id and p.user_id = auth.uid()));

create policy "Certifications: owner all" on certifications for all
  using (exists (select 1 from profiles p where p.id = certifications.profile_id and p.user_id = auth.uid()));

create policy "Career goals: owner all" on career_goals for all
  using (exists (select 1 from profiles p where p.id = career_goals.profile_id and p.user_id = auth.uid()));

create policy "Roadmaps: owner all" on roadmaps for all
  using (exists (select 1 from profiles p where p.id = roadmaps.profile_id and p.user_id = auth.uid()));

create policy "Roadmap items: owner all" on roadmap_items for all
  using (exists (
    select 1 from roadmaps r join profiles p on p.id = r.profile_id
    where r.id = roadmap_items.roadmap_id and p.user_id = auth.uid()
  ));

create policy "Assessment results: owner all" on assessment_results for all
  using (exists (select 1 from profiles p where p.id = assessment_results.profile_id and p.user_id = auth.uid()));

create policy "Mentor messages: owner all" on mentor_messages for all
  using (exists (select 1 from profiles p where p.id = mentor_messages.profile_id and p.user_id = auth.uid()));

-- role_skills, assessments, and industry_trends are reference / demo
-- data readable by any authenticated user; no per-row ownership.
alter table role_skills enable row level security;
alter table assessments enable row level security;
alter table industry_trends enable row level security;

create policy "Role skills: read all" on role_skills for select using (true);
create policy "Assessments: read all" on assessments for select using (true);
create policy "Industry trends: read all" on industry_trends for select using (true);

-- Placement-cell / recruiter dashboards would typically use a separate
-- "staff" role with broader read policies across profiles — omitted
-- here since this prototype's placement/recruiter views run on local
-- demo cohort data (see src/data/cohortDemoData.ts), not this schema.
