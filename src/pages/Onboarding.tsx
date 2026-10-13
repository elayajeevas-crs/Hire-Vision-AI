import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Button, Card, SectionHeading } from '@/components/ui/Primitives';
import { createBlankProfile } from '@/data/demoStudent';
import { listRoleNames, ROLE_SKILL_MATRIX } from '@/data/roleSkillMatrix';
import type { CertificationEntry, ProjectEntry, SkillProficiency, StudentProfile } from '@/types';
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/context/ToastContext';
import { uid } from '@/lib/utils';

const inputClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber';
const labelClass = 'mb-1 block text-sm text-mist-300';

export function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useAppState();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<StudentProfile>(createBlankProfile());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const domains = [...new Set(ROLE_SKILL_MATRIX.map((r) => r.domain))];

  function update<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function addSkill() {
    update('skills', [...profile.skills, { skill: '', proficiency: 50 }]);
  }
  function updateSkill(index: number, patch: Partial<SkillProficiency>) {
    const next = profile.skills.map((s, i) => (i === index ? { ...s, ...patch } : s));
    update('skills', next);
  }
  function removeSkill(index: number) {
    update('skills', profile.skills.filter((_, i) => i !== index));
  }

  function addProject() {
    const p: ProjectEntry = { id: uid('proj'), title: '', description: '', skillsUsed: [] };
    update('projects', [...profile.projects, p]);
  }
  function updateProject(index: number, patch: Partial<ProjectEntry>) {
    const next = profile.projects.map((p, i) => (i === index ? { ...p, ...patch } : p));
    update('projects', next);
  }
  function removeProject(index: number) {
    update('projects', profile.projects.filter((_, i) => i !== index));
  }

  function addCertification() {
    const c: CertificationEntry = { id: uid('cert'), name: '', issuer: '' };
    update('certifications', [...profile.certifications, c]);
  }
  function updateCertification(index: number, patch: Partial<CertificationEntry>) {
    const next = profile.certifications.map((c, i) => (i === index ? { ...c, ...patch } : c));
    update('certifications', next);
  }
  function removeCertification(index: number) {
    update('certifications', profile.certifications.filter((_, i) => i !== index));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!profile.name.trim()) errs.name = 'Name is required.';
    if (!profile.email.trim()) errs.email = 'Email is required.';
    if (!profile.college.trim()) errs.college = 'College is required.';
    if (!profile.degree.trim()) errs.degree = 'Degree is required.';
    if (!profile.targetRole.trim()) errs.targetRole = 'Choose a target job role.';
    if (profile.cgpa < 0 || profile.cgpa > 10) errs.cgpa = 'CGPA should be between 0 and 10.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }
    const cleanedSkills = profile.skills.filter((s) => s.skill.trim().length > 0);
    const cleanedProjects = profile.projects.filter((p) => p.title.trim().length > 0);
    const cleanedCerts = profile.certifications.filter((c) => c.name.trim().length > 0);
    const finalProfile: StudentProfile = { ...profile, skills: cleanedSkills, projects: cleanedProjects, certifications: cleanedCerts };
    saveProfile(finalProfile);
    showToast('Profile saved — building your career twin.', 'success');
    navigate('/app/dashboard');
  }

  return (
    <div className="min-h-screen bg-ink-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="text-signal-amber" size={20} />
          <span className="font-display text-lg font-semibold">HireVision AI</span>
        </div>
        <SectionHeading
          title="Build your career twin"
          description="This creates a digital representation of your academic performance, skills, projects and goals — the foundation for every score and recommendation in the app."
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Card>
            <h2 className="mb-4 font-display text-base font-semibold">Basic details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">Full name</label>
                <input id="name" className={inputClass} value={profile.name} onChange={(e) => update('name', e.target.value)} />
                {errors.name && <p className="mt-1 text-xs text-signal-coral">{errors.name}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input id="email" type="email" className={inputClass} value={profile.email} onChange={(e) => update('email', e.target.value)} />
                {errors.email && <p className="mt-1 text-xs text-signal-coral">{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="college">College</label>
                <input id="college" className={inputClass} value={profile.college} onChange={(e) => update('college', e.target.value)} />
                {errors.college && <p className="mt-1 text-xs text-signal-coral">{errors.college}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="degree">Degree</label>
                <input id="degree" className={inputClass} value={profile.degree} onChange={(e) => update('degree', e.target.value)} placeholder="B.E Computer Science" />
                {errors.degree && <p className="mt-1 text-xs text-signal-coral">{errors.degree}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="department">Department</label>
                <input id="department" className={inputClass} value={profile.department} onChange={(e) => update('department', e.target.value)} />
              </div>
              <div>
                <label className={labelClass} htmlFor="year">Year / Semester</label>
                <div className="flex gap-2">
                  <input id="year" className={inputClass} placeholder="3rd Year" value={profile.yearOfStudy} onChange={(e) => update('yearOfStudy', e.target.value)} />
                  <input className={inputClass} placeholder="5th Semester" value={profile.semester} onChange={(e) => update('semester', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="cgpa">CGPA (0–10)</label>
                <input
                  id="cgpa"
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  className={inputClass}
                  value={profile.cgpa || ''}
                  onChange={(e) => update('cgpa', Number(e.target.value))}
                />
                {errors.cgpa && <p className="mt-1 text-xs text-signal-coral">{errors.cgpa}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="targetRole">Target job role</label>
                <select id="targetRole" className={inputClass} value={profile.targetRole} onChange={(e) => update('targetRole', e.target.value)}>
                  <option value="">Select a role</option>
                  {listRoleNames().map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.targetRole && <p className="mt-1 text-xs text-signal-coral">{errors.targetRole}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="domain">Preferred domain</label>
                <select id="domain" className={inputClass} value={profile.preferredDomain} onChange={(e) => update('preferredDomain', e.target.value)}>
                  <option value="">Select a domain</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Technical skills</h2>
              <Button variant="secondary" onClick={addSkill}><Plus size={14} /> Add skill</Button>
            </div>
            {profile.skills.length === 0 && <p className="text-sm text-mist-400">Add the skills you already have, with an honest proficiency estimate.</p>}
            <div className="flex flex-col gap-3">
              {profile.skills.map((s, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3">
                  <input
                    className={`${inputClass} flex-1 min-w-[140px]`}
                    placeholder="e.g. SQL"
                    value={s.skill}
                    onChange={(e) => updateSkill(i, { skill: e.target.value })}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={s.proficiency}
                    onChange={(e) => updateSkill(i, { proficiency: Number(e.target.value) })}
                    className="w-40 accent-signal-amber"
                  />
                  <span className="w-10 text-right text-sm text-mist-300">{s.proficiency}</span>
                  <button type="button" onClick={() => removeSkill(i)} className="text-mist-400 hover:text-signal-coral" aria-label="Remove skill">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Projects</h2>
              <Button variant="secondary" onClick={addProject}><Plus size={14} /> Add project</Button>
            </div>
            <div className="flex flex-col gap-4">
              {profile.projects.map((p, i) => (
                <div key={p.id} className="rounded-lg border border-ink-700 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      className={inputClass}
                      placeholder="Project title"
                      value={p.title}
                      onChange={(e) => updateProject(i, { title: e.target.value })}
                    />
                    <button type="button" onClick={() => removeProject(i)} className="ml-2 text-mist-400 hover:text-signal-coral" aria-label="Remove project">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    className={`${inputClass} mt-2`}
                    placeholder="Short description"
                    rows={2}
                    value={p.description}
                    onChange={(e) => updateProject(i, { description: e.target.value })}
                  />
                  <input
                    className={`${inputClass} mt-2`}
                    placeholder="Skills used (comma separated)"
                    value={p.skillsUsed.join(', ')}
                    onChange={(e) => updateProject(i, { skillsUsed: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Certifications</h2>
              <Button variant="secondary" onClick={addCertification}><Plus size={14} /> Add certification</Button>
            </div>
            <div className="flex flex-col gap-3">
              {profile.certifications.map((c, i) => (
                <div key={c.id} className="flex flex-wrap items-center gap-3">
                  <input
                    className={`${inputClass} flex-1 min-w-[140px]`}
                    placeholder="Certification name"
                    value={c.name}
                    onChange={(e) => updateCertification(i, { name: e.target.value })}
                  />
                  <input
                    className={`${inputClass} flex-1 min-w-[140px]`}
                    placeholder="Issuer (optional)"
                    value={c.issuer ?? ''}
                    onChange={(e) => updateCertification(i, { issuer: e.target.value })}
                  />
                  <button type="button" onClick={() => removeCertification(i)} className="text-mist-400 hover:text-signal-coral" aria-label="Remove certification">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-display text-base font-semibold">Activities & interests</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="extras">Extracurricular activities (comma separated)</label>
                <input
                  id="extras"
                  className={inputClass}
                  value={profile.extracurriculars.join(', ')}
                  onChange={(e) => update('extracurriculars', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="interests">Career interests (comma separated)</label>
                <input
                  id="interests"
                  className={inputClass}
                  value={profile.interests.join(', ')}
                  onChange={(e) => update('interests', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit">Save profile & build my twin</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
