import React from 'react';
import { Users, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, SectionHeading, Badge } from '@/components/ui/Primitives';
import { PLACEMENT_COHORT, READINESS_HISTORY } from '@/data/cohortDemoData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function PlacementDashboard() {
  const total = PLACEMENT_COHORT.length;
  const avgReadiness = Math.round(PLACEMENT_COHORT.reduce((s, c) => s + c.readiness, 0) / total);
  const needingIntervention = PLACEMENT_COHORT.filter((c) => c.needsIntervention);

  const deptMap: Record<string, { total: number; sum: number }> = {};
  for (const s of PLACEMENT_COHORT) {
    deptMap[s.department] = deptMap[s.department] ?? { total: 0, sum: 0 };
    deptMap[s.department].total += 1;
    deptMap[s.department].sum += s.readiness;
  }
  const deptData = Object.entries(deptMap).map(([dept, v]) => ({ dept: dept.split(' ')[0], avg: Math.round(v.sum / v.total) }));

  const roleMap: Record<string, { total: number; sum: number }> = {};
  for (const s of PLACEMENT_COHORT) {
    roleMap[s.targetRole] = roleMap[s.targetRole] ?? { total: 0, sum: 0 };
    roleMap[s.targetRole].total += 1;
    roleMap[s.targetRole].sum += s.readiness;
  }
  const roleData = Object.entries(roleMap).map(([role, v]) => ({ role, avg: Math.round(v.sum / v.total) }));

  const topGapSkills = ['SQL', 'Power BI', 'React', 'Machine Learning', 'Statistics'];

  return (
    <div>
      <SectionHeading title="Placement Dashboard" description="Cohort readiness overview for colleges and placement cells. Demo cohort of 8 students." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Users className="text-signal-teal" size={20} />
          <p className="mt-3 font-display text-2xl font-semibold">{total}</p>
          <p className="text-sm text-mist-400">Total students</p>
        </Card>
        <Card>
          <BarChart3 className="text-signal-amber" size={20} />
          <p className="mt-3 font-display text-2xl font-semibold">{avgReadiness}</p>
          <p className="text-sm text-mist-400">Average readiness</p>
        </Card>
        <Card>
          <AlertTriangle className="text-signal-coral" size={20} />
          <p className="mt-3 font-display text-2xl font-semibold">{needingIntervention.length}</p>
          <p className="text-sm text-mist-400">Need intervention</p>
        </Card>
        <Card>
          <TrendingUp className="text-signal-teal" size={20} />
          <p className="mt-3 font-display text-2xl font-semibold">+{READINESS_HISTORY[READINESS_HISTORY.length - 1].avgReadiness - READINESS_HISTORY[0].avgReadiness}</p>
          <p className="text-sm text-mist-400">Readiness gain (6 mo)</p>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Progress over time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={READINESS_HISTORY}>
              <CartesianGrid stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="month" stroke="#8592B4" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#8592B4" fontSize={12} width={30} />
              <Tooltip contentStyle={{ background: '#161F38', border: '1px solid #2A3B63', borderRadius: 8 }} />
              <Line type="monotone" dataKey="avgReadiness" stroke="#2FD9C4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Department-wise readiness</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData}>
              <CartesianGrid stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="dept" stroke="#8592B4" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#8592B4" fontSize={12} width={30} />
              <Tooltip contentStyle={{ background: '#161F38', border: '1px solid #2A3B63', borderRadius: 8 }} />
              <Bar dataKey="avg" fill="#F5A623" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Role-wise readiness</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={roleData} layout="vertical">
              <CartesianGrid stroke="#1E2A4A" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#8592B4" fontSize={12} />
              <YAxis type="category" dataKey="role" stroke="#8592B4" fontSize={11} width={110} />
              <Tooltip contentStyle={{ background: '#161F38', border: '1px solid #2A3B63', borderRadius: 8 }} />
              <Bar dataKey="avg" fill="#2FD9C4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Top skill gaps across cohort</h3>
          <div className="flex flex-wrap gap-2">
            {topGapSkills.map((s) => <Badge key={s} tone="coral">{s}</Badge>)}
          </div>
          <h3 className="mb-2 mt-5 font-display text-base font-semibold">Students needing intervention</h3>
          <div className="flex flex-col gap-2">
            {needingIntervention.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-signal-coral/30 bg-signal-coral/5 px-3 py-2 text-sm">
                <span>{s.name} · {s.targetRole}</span>
                <span className="text-signal-coral">{s.readiness}/100</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
