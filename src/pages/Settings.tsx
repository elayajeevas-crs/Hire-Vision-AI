import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, SectionHeading, Button } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/context/ToastContext';
import { isLiveAIConfigured } from '@/lib/aiService';
import type { StudentProfile } from '@/types';

export function Settings() {
  const { profile, saveProfile, resetAll } = useAppState();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name ?? '');
  const [college, setCollege] = useState(profile?.college ?? '');

  const currentProfile = profile;
  if (!currentProfile) return null;

  function handleSave() {
    if (!currentProfile) return;

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      name: name.trim() || currentProfile.name,
      college: college.trim() || currentProfile.college,
    };
    saveProfile(updatedProfile);
    showToast('Settings saved.', 'success');
  }

  function handleReset() {
    resetAll();
    showToast('All local data cleared.', 'info');
    navigate('/');
  }

  return (
    <div>
      <SectionHeading title="Settings" description="Manage your profile and prototype configuration." />

      <Card className="mb-5">
        <h3 className="mb-3 font-display text-base font-semibold">Profile</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-mist-300" htmlFor="name">Full name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-mist-300" htmlFor="college">College</label>
            <input
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleSave}>Save changes</Button>
      </Card>

      <Card className="mb-5">
        <h3 className="mb-3 font-display text-base font-semibold">AI Mentor configuration</h3>
        <p className="text-sm text-mist-400">
          Live AI: <span className={isLiveAIConfigured() ? 'text-signal-teal' : 'text-signal-amber'}>{isLiveAIConfigured() ? 'Connected' : 'Not configured — using Offline Mentor'}</span>
        </p>
        <p className="mt-2 text-sm text-mist-400">
          Set VITE_AI_API_KEY, VITE_AI_BASE_URL and VITE_AI_MODEL in your .env file to connect a live OpenAI-compatible model. See .env.example.
        </p>
      </Card>

      <Card>
        <h3 className="mb-2 font-display text-base font-semibold text-signal-coral">Danger zone</h3>
        <p className="mb-3 text-sm text-mist-400">Clears your profile, scores, roadmap and mentor history from this browser.</p>
        <Button variant="danger" onClick={handleReset}>Reset all local data</Button>
      </Card>
    </div>
  );
}
