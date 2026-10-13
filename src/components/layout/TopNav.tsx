import React from 'react';
import { Menu, LogOut, FlaskConical } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Primitives';

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile, isDemoMode, logout } = useAppState();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-700 bg-ink-950/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-mist-300 hover:bg-ink-800 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        {isDemoMode && (
          <Badge tone="amber">
            <FlaskConical size={12} /> Demo Mode
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-3">
        {profile && (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-mist-100">{profile.name || 'Student'}</p>
            <p className="text-xs text-mist-400">{profile.targetRole || 'No target role set'}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-sm text-mist-300 hover:bg-ink-800"
        >
          <LogOut size={15} /> Log out
        </button>
      </div>
    </header>
  );
}
