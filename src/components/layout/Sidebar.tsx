import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCircle2,
  Target,
  Map,
  MessageCircle,
  FolderKanban,
  TrendingUp,
  ClipboardCheck,
  Mic2,
  Building2,
  Briefcase,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import { cx } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/career-twin', label: 'Career Twin', icon: UserCircle2 },
  { to: '/app/skill-gap', label: 'Skill Gap', icon: Target },
  { to: '/app/roadmap', label: 'Roadmap', icon: Map },
  { to: '/app/mentor', label: 'AI Mentor', icon: MessageCircle },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/trends', label: 'Industry Trends', icon: TrendingUp },
  { to: '/app/assessment', label: 'Assessment', icon: ClipboardCheck },
  { to: '/app/interview-prep', label: 'Interview Prep', icon: Mic2 },
  { to: '/app/placement', label: 'Placement Dashboard', icon: Building2 },
  { to: '/app/recruiter', label: 'Recruiter View', icon: Briefcase },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cx(
          'fixed z-40 h-full w-64 shrink-0 border-r border-ink-700 bg-ink-900 p-4 transition-transform md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-6 flex items-center gap-2 px-2">
          <Sparkles className="text-signal-amber" size={22} />
          <span className="font-display text-lg font-semibold">HireVision AI</span>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-signal-amber/10 text-signal-amber' : 'text-mist-300 hover:bg-ink-800 hover:text-mist-100',
                )
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
