import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthed, profile } = useAppState();

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}
