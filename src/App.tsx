import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from '@/context/AppStateContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Onboarding } from '@/pages/Onboarding';
import { Dashboard } from '@/pages/Dashboard';
import { CareerTwin } from '@/pages/CareerTwin';
import { SkillGap } from '@/pages/SkillGap';
import { RoadmapPage } from '@/pages/Roadmap';
import { AIMentor } from '@/pages/AIMentor';
import { Projects } from '@/pages/Projects';
import { IndustryTrends } from '@/pages/IndustryTrends';
import { Assessment } from '@/pages/Assessment';
import { InterviewPrep } from '@/pages/InterviewPrep';
import { PlacementDashboard } from '@/pages/PlacementDashboard';
import { RecruiterDashboard } from '@/pages/RecruiterDashboard';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="career-twin" element={<CareerTwin />} />
              <Route path="skill-gap" element={<SkillGap />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="mentor" element={<AIMentor />} />
              <Route path="projects" element={<Projects />} />
              <Route path="trends" element={<IndustryTrends />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="interview-prep" element={<InterviewPrep />} />
              <Route path="placement" element={<PlacementDashboard />} />
              <Route path="recruiter" element={<RecruiterDashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppStateProvider>
  );
}
