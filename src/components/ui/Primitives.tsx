import React from 'react';
import { cx } from '@/lib/utils';

export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return (
    <Tag className={cx('rounded-xl2 border border-ink-700 bg-ink-800/60 p-5', className)}>
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'amber' | 'teal' | 'coral';
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-ink-700 text-mist-200 border-ink-600',
    amber: 'bg-signal-amber/10 text-signal-amber border-signal-amber/30',
    teal: 'bg-signal-teal/10 text-signal-teal border-signal-teal/30',
    coral: 'bg-signal-coral/10 text-signal-coral border-signal-coral/30',
  };
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, tone = 'amber' }: { value: number; tone?: 'amber' | 'teal' | 'coral' }) {
  const colors: Record<string, string> = {
    amber: 'bg-signal-amber',
    teal: 'bg-signal-teal',
    coral: 'bg-signal-coral',
  };
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-700" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx('h-full rounded-full transition-[width] duration-500', colors[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function ScoreRing({ score, size = 140, label }: { score: number; size?: number; label?: string }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped >= 75 ? '#2FD9C4' : clamped >= 50 ? '#F5A623' : '#F2637A';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1E2A4A" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={10}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 700ms ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-semibold text-mist-100">{Math.round(clamped)}</span>
        {label && <span className="text-xs text-mist-400">{label}</span>}
      </div>
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-signal-amber text-ink-950 hover:brightness-110 disabled:opacity-50',
    secondary: 'bg-ink-700 text-mist-100 hover:bg-ink-600 border border-ink-600',
    ghost: 'bg-transparent text-mist-200 hover:bg-ink-800 border border-transparent',
    danger: 'bg-signal-coral/15 text-signal-coral border border-signal-coral/30 hover:bg-signal-coral/25',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 disabled:cursor-not-allowed',
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-600 p-10 text-center">
      {icon}
      <h3 className="font-display text-lg text-mist-100">{title}</h3>
      <p className="max-w-sm text-sm text-mist-400">{description}</p>
      {action}
    </div>
  );
}

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold text-mist-100 md:text-3xl">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-mist-400">{description}</p>}
    </div>
  );
}
