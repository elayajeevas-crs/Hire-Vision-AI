import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { Card, SectionHeading, ProgressBar, Badge } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import { cx } from '@/lib/utils';

export function RoadmapPage() {
  const { roadmap, toggleRoadmapTask } = useAppState();
  const [expanded, setExpanded] = useState<string | null>(roadmap?.weeks[0]?.id ?? null);

  if (!roadmap) return null;

  const overallProgress = Math.round(
    roadmap.weeks.reduce((sum, w) => sum + w.progress, 0) / (roadmap.weeks.length || 1),
  );

  return (
    <div>
      <SectionHeading
        title="8-Week Personalized Roadmap"
        description={`Sequenced from your current skill gaps toward ${roadmap.role}. Overall progress: ${overallProgress}%.`}
      />
      <div className="mb-5">
        <ProgressBar value={overallProgress} tone="teal" />
      </div>

      <div className="flex flex-col gap-3">
        {roadmap.weeks.map((week) => {
          const isOpen = expanded === week.id;
          return (
            <Card key={week.id} className="p-0 overflow-hidden">
              <button
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setExpanded(isOpen ? null : week.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  {week.completed ? (
                    <CheckCircle2 className="text-signal-teal shrink-0" size={20} />
                  ) : (
                    <Circle className="text-mist-400 shrink-0" size={20} />
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-mist-400">{week.weekLabel}</p>
                    <p className="font-display text-base font-semibold text-mist-100">{week.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm text-mist-400 sm:inline">{week.progress}%</span>
                  {isOpen ? <ChevronUp size={18} className="text-mist-400" /> : <ChevronDown size={18} className="text-mist-400" />}
                </div>
              </button>

              <div className="px-5 pb-2">
                <ProgressBar value={week.progress} tone={week.completed ? 'teal' : 'amber'} />
              </div>

              {isOpen && (
                <div className="border-t border-ink-700 px-5 py-4">
                  <p className="text-sm text-mist-300">{week.learningObjective}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {week.targetSkills.map((s) => (
                      <Badge key={s} tone="amber">{s}</Badge>
                    ))}
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-wide text-mist-400">Suggested resources</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-mist-400">
                      {week.suggestedResources.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-wide text-mist-400">Mini tasks</p>
                    <div className="flex flex-col gap-2">
                      {week.miniTasks.map((task) => (
                        <label key={task.id} className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleRoadmapTask(week.id, task.id)}
                            className="h-4 w-4 accent-signal-amber"
                          />
                          <span className={cx(task.done ? 'text-mist-500 line-through' : 'text-mist-200')}>{task.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {week.projectMilestone && (
                    <p className="mt-4 rounded-lg border border-signal-teal/30 bg-signal-teal/5 px-3 py-2 text-sm text-signal-teal">
                      Milestone: {week.projectMilestone}
                    </p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
