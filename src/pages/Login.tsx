import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, FlaskConical } from 'lucide-react';
import { Button, Card } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/context/ToastContext';

export function Login() {
  const navigate = useNavigate();
  const { login, loadDemoMode, profile } = useAppState();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter an email and password to continue (any values work in this prototype).');
      return;
    }
    setError('');
    login();
    showToast('Logged in successfully.', 'success');
    navigate(profile ? '/app/dashboard' : '/onboarding');
  }

  function handleDemo() {
    loadDemoMode();
    showToast('Demo profile loaded — welcome, Arun!', 'success');
    navigate('/app/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="text-signal-amber" size={22} />
          <span className="font-display text-lg font-semibold">HireVision AI</span>
        </div>
        <h1 className="font-display text-xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-mist-400">Log in to continue building your career twin.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-mist-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
              placeholder="you@college.edu"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-mist-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-signal-coral">{error}</p>}
          <Button type="submit" className="w-full">Log in</Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-mist-400">
          <div className="h-px flex-1 bg-ink-700" />
          or
          <div className="h-px flex-1 bg-ink-700" />
        </div>

        <Button variant="secondary" className="w-full" onClick={handleDemo}>
          <FlaskConical size={16} /> Use Demo Mode (Arun Kumar)
        </Button>

        <p className="mt-6 text-center text-sm text-mist-400">
          New here?{' '}
          <Link to="/onboarding" className="text-signal-amber hover:underline">
            Create your profile
          </Link>
        </p>
      </Card>
    </div>
  );
}
