import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Zap, ArrowRight } from 'lucide-react';
import { Card, SectionHeading, ScoreRing, Button, Badge } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { useToast } from '@/context/ToastContext';
import { topGapSkills } from '@/lib/skillGap';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function Dashboard() {
  const { profile, latestEmployability, employabilityHistory, roadmap, isDemoMode, simulateImprovement } = useAppState();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!profile || !latestEmployability) return null;

  const gaps = topGapSkills(profile, 3);
  const chartData = employabilityHistory.map((h, i) => ({ name: `#${i + 1}`, score: h.score }));
  const currentWeek = roadmap?.weeks.find((w) => !w.completed) ?? roadmap?.weeks[0];

  function handleSimulate() {
    simulateImprovement();
    showToast('Simulated improvement applied — scores and roadmap updated.', 'success');
  }

  return (
    <div>
      <SectionHeading
        title={`Welcome, ${profile.name.split(' ')[0] || 'there'}`}
        description={`Career twin for ${profile.targetRole || 'your target role'} · ${profile.college || 'your college'}`}
      />

      {isDemoMode && (
        <Card className="mb-6 flex flex-col items-start justify-between gap-3 border-signal-amber/30 bg-signal-amber/5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-signal-amber">Demo Mode is active</p>
            <p className="text-sm text-mist-400">Click "Simulate Improvement" to see how closing skill gaps moves the score and roadmap.</p>
          </div>
          <Button onClick={handleSimulate}><Zap size={15} /> Simulate Improvement</Button>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center md:col-span-1">
          <p className="mb-3 text-xs uppercase tracking-wide text-mist-400">Employability Score</p>
          <ScoreRing score={latestEmployability.score} label="/ 100" />
          <div className="mt-3 flex items-center gap-1 text-sm">
            {latestEmployability.change >= 0 ? (
              <TrendingUp size={15} className="text-signal-teal" />
            ) : (
              <TrendingDown size={15} className="text-signal-coral" />
            )}
            <span className={latestEmployability.change >= 0 ? 'text-signal-teal' : 'text-signal-coral'}>
              {latestEmployability.change >= 0 ? '+' : ''}{latestEmployability.change} vs previous
            </span>
          </div>
          <Link to="/app/career-twin" className="mt-4 text-sm text-signal-amber hover:underline">View full breakdown</Link>
        </Card>

        <Card className="md:col-span-2">
          <p className="mb-2 text-xs uppercase tracking-wide text-mist-400">Score history</p>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1E2A4A" vertical={false} />
                <XAxis dataKey="name" stroke="#8592B4" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#8592B4" fontSize={12} width={30} />
                <Tooltip contentStyle={{ background: '#161F38', border: '1px solid #2A3B63', borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="#F5A623" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-40 items-center justify-center text-sm text-mist-400">
              Your score history will appear here after your next update.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Top skill gaps</h3>
            <Link to="/app/skill-gap" className="text-sm text-signal-amber hover:underline">See all</Link>
          </div>
          <div className="flex flex-col gap-3">
            {gaps.map((g) => (
              <div key={g.skill} className="flex items-center justify-between rounded-lg border border-ink-700 px-3 py-2">
                <div>
                  <p className="text-sm text-mist-100">{g.skill}</p>
                  <p className="text-xs text-mist-400">{g.current} → {g.target}</p>
                </div>
                <Badge tone={g.priority === 'High' ? 'coral' : g.priority === 'Medium' ? 'amber' : 'teal'}>{g.priority}</Badge>
              </div>
            ))}
            {gaps.length === 0 && <p className="text-sm text-mist-400">No significant gaps detected for your target role.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">This week's roadmap focus</h3>
            <Link to="/app/roadmap" className="text-sm text-signal-amber hover:underline">Open roadmap</Link>
          </div>
          {currentWeek ? (
            <div>
              <p className="text-sm font-medium text-mist-100">{currentWeek.weekLabel}: {currentWeek.title}</p>
              <p className="mt-1 text-sm text-mist-400">{currentWeek.learningObjective}</p>
              <div className="mt-3 h-2 rounded-full bg-ink-700">
                <div className="h-full rounded-full bg-signal-teal" style={{ width: `${currentWeek.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-mist-400">{currentWeek.progress}% complete</p>
            </div>
          ) : (
            <p className="text-sm text-mist-400">No roadmap generated yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Ask your AI Mentor</h3>
            <p className="mt-1 text-sm text-mist-400">Get an answer grounded in your own profile and gaps.</p>
          </div>
          <Button variant="secondary" className="mt-4 self-start" onClick={() => navigate('/app/mentor')}>
            Open Mentor <ArrowRight size={14} />
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Recommended project</h3>
            <p className="mt-1 text-sm text-mist-400">Built directly from your biggest skill gaps.</p>
          </div>
          <Button variant="secondary" className="mt-4 self-start" onClick={() => navigate('/app/projects')}>
            View projects <ArrowRight size={14} />
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Practice an interview</h3>
            <p className="mt-1 text-sm text-mist-400">Answer a question and get instant feedback.</p>
          </div>
          <Button variant="secondary" className="mt-4 self-start" onClick={() => navigate('/app/interview-prep')}>
            Start prepping <ArrowRight size={14} />
          </Button>
        </Card>
      </div>
    </div>
  );
}
