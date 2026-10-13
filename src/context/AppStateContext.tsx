import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { EmployabilityResult, MentorMessage, Roadmap, StudentProfile } from '@/types';
import { DEMO_STUDENT } from '@/data/demoStudent';
import { computeEmployabilityScore } from '@/lib/scoring';
import { generateRoadmap, recalculateWeekProgress } from '@/lib/roadmap';
import { loadJSON, saveJSON, STORAGE_KEYS, clearAll } from '@/lib/storage';
import { uid } from '@/lib/utils';

interface AppState {
  isAuthed: boolean;
  isDemoMode: boolean;
  profile: StudentProfile | null;
  employabilityHistory: EmployabilityResult[];
  latestEmployability: EmployabilityResult | null;
  roadmap: Roadmap | null;
  mentorMessages: MentorMessage[];

  login: () => void;
  logout: () => void;
  loadDemoMode: () => void;
  saveProfile: (profile: StudentProfile) => void;
  recomputeScore: () => void;
  toggleRoadmapTask: (weekId: string, taskId: string) => void;
  simulateImprovement: () => void;
  addMentorMessage: (msg: MentorMessage) => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => loadJSON(STORAGE_KEYS.authed, false));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => loadJSON(STORAGE_KEYS.demoMode, false));
  const [profile, setProfile] = useState<StudentProfile | null>(() => loadJSON<StudentProfile | null>(STORAGE_KEYS.profile, null));
  const [employabilityHistory, setEmployabilityHistory] = useState<EmployabilityResult[]>(() =>
    loadJSON<EmployabilityResult[]>(STORAGE_KEYS.employabilityHistory, []),
  );
  const [roadmap, setRoadmap] = useState<Roadmap | null>(() => loadJSON<Roadmap | null>(STORAGE_KEYS.roadmap, null));
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>(() =>
    loadJSON<MentorMessage[]>(STORAGE_KEYS.mentorMessages, []),
  );

  useEffect(() => saveJSON(STORAGE_KEYS.authed, isAuthed), [isAuthed]);
  useEffect(() => saveJSON(STORAGE_KEYS.demoMode, isDemoMode), [isDemoMode]);
  useEffect(() => saveJSON(STORAGE_KEYS.profile, profile), [profile]);
  useEffect(() => saveJSON(STORAGE_KEYS.employabilityHistory, employabilityHistory), [employabilityHistory]);
  useEffect(() => saveJSON(STORAGE_KEYS.roadmap, roadmap), [roadmap]);
  useEffect(() => saveJSON(STORAGE_KEYS.mentorMessages, mentorMessages), [mentorMessages]);

  const latestEmployability = employabilityHistory.length > 0 ? employabilityHistory[employabilityHistory.length - 1] : null;

  const recomputeScoreFor = useCallback(
    (p: StudentProfile, history: EmployabilityResult[]) => {
      const previous = history.length > 0 ? history[history.length - 1].score : 0;
      const result = computeEmployabilityScore(p, previous);
      return result;
    },
    [],
  );

  const login = useCallback(() => setIsAuthed(true), []);
  const logout = useCallback(() => setIsAuthed(false), []);

  const saveProfile = useCallback(
    (p: StudentProfile) => {
      setProfile(p);
      setEmployabilityHistory((prev) => {
        const result = recomputeScoreFor(p, prev);
        return [...prev, result];
      });
      setRoadmap(generateRoadmap(p));
      setIsAuthed(true);
    },
    [recomputeScoreFor],
  );

  const recomputeScore = useCallback(() => {
    if (!profile) return;
    setEmployabilityHistory((prev) => {
      const result = recomputeScoreFor(profile, prev);
      return [...prev, result];
    });
  }, [profile, recomputeScoreFor]);

  const loadDemoMode = useCallback(() => {
    setProfile(DEMO_STUDENT);
    setIsDemoMode(true);
    setIsAuthed(true);
    const fixedInitialScore: EmployabilityResult = computeEmployabilityScore(DEMO_STUDENT, 0);
    // The source brief calls for a fixed, memorable starting score of 62
    // for the demo script. We compute it explainably above, and nudge the
    // displayed total to the documented demo value while keeping the
    // breakdown fully derived from the formula for transparency.
    const demoResult: EmployabilityResult = { ...fixedInitialScore, score: 62, change: 62 };
    setEmployabilityHistory([demoResult]);
    setRoadmap(generateRoadmap(DEMO_STUDENT));
    setMentorMessages([]);
  }, []);

  const toggleRoadmapTask = useCallback((weekId: string, taskId: string) => {
    setRoadmap((prev) => {
      if (!prev) return prev;
      const weeks = prev.weeks.map((week) => {
        if (week.id !== weekId) return week;
        const miniTasks = week.miniTasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
        return recalculateWeekProgress({ ...week, miniTasks });
      });
      return { ...prev, weeks };
    });
  }, []);

  const simulateImprovement = useCallback(() => {
    if (!profile) return;
    // Deterministic simulation: bump the biggest-gap skills and mark
    // some roadmap progress, matching the documented 62 -> 70 -> 78 arc.
    const boostedSkills = profile.skills.map((s) => {
      if (['SQL', 'Power BI', 'Statistics'].includes(s.skill)) {
        return { ...s, proficiency: Math.min(100, s.proficiency + 20) };
      }
      return s;
    });
    const updatedProfile: StudentProfile = { ...profile, skills: boostedSkills };
    setProfile(updatedProfile);

    setRoadmap((prev) => {
      if (!prev) return prev;
      let bumped = 0;
      const weeks = prev.weeks.map((week) => {
        if (bumped >= 2) return week;
        const allDone = week.miniTasks.every((t) => t.done);
        if (allDone) return week;
        bumped += 1;
        const miniTasks = week.miniTasks.map((t, idx) => (idx === 0 ? { ...t, done: true } : t));
        return recalculateWeekProgress({ ...week, miniTasks });
      });
      return { ...prev, weeks };
    });

    setEmployabilityHistory((prev) => {
      const previous = prev.length > 0 ? prev[prev.length - 1].score : 62;
      const result = recomputeScoreFor(updatedProfile, prev);
      // Step the score toward the documented demo arc (62 -> 70 -> 78)
      // while keeping the underlying breakdown formula-driven.
      const nextStep = previous >= 78 ? previous : previous + 8;
      const stepped: EmployabilityResult = { ...result, score: Math.min(nextStep, Math.max(nextStep, result.score)), previousScore: previous };
      stepped.change = stepped.score - previous;
      return [...prev, stepped];
    });
  }, [profile, recomputeScoreFor]);

  const addMentorMessage = useCallback((msg: MentorMessage) => {
    setMentorMessages((prev) => [...prev, msg]);
  }, []);

  const resetAll = useCallback(() => {
    clearAll();
    setIsAuthed(false);
    setIsDemoMode(false);
    setProfile(null);
    setEmployabilityHistory([]);
    setRoadmap(null);
    setMentorMessages([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      isAuthed,
      isDemoMode,
      profile,
      employabilityHistory,
      latestEmployability,
      roadmap,
      mentorMessages,
      login,
      logout,
      loadDemoMode,
      saveProfile,
      recomputeScore,
      toggleRoadmapTask,
      simulateImprovement,
      addMentorMessage,
      resetAll,
    }),
    [
      isAuthed,
      isDemoMode,
      profile,
      employabilityHistory,
      latestEmployability,
      roadmap,
      mentorMessages,
      login,
      logout,
      loadDemoMode,
      saveProfile,
      recomputeScore,
      toggleRoadmapTask,
      simulateImprovement,
      addMentorMessage,
      resetAll,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export function newMessageId(): string {
  return uid('msg');
}
