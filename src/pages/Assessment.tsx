import React, { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Card, SectionHeading, Badge, Button, ProgressBar } from '@/components/ui/Primitives';
import { getQuestionsForRole } from '@/data/assessmentBank';
import type { AssessmentResult } from '@/types';
import { useToast } from '@/context/ToastContext';

export function Assessment() {
  const questions = getQuestionsForRole();
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mcqSelections, setMcqSelections] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  function handleSubmit() {
    let correct = 0;
    const skillMap: Record<string, { correct: number; total: number }> = {};

    for (const q of questions) {
      skillMap[q.skill] = skillMap[q.skill] ?? { correct: 0, total: 0 };
      skillMap[q.skill].total += 1;

      if (q.type === 'mcq') {
        const isCorrect = mcqSelections[q.id] === q.correctOptionIndex;
        if (isCorrect) {
          correct += 1;
          skillMap[q.skill].correct += 1;
        }
      } else {
        // Coding / scenario: rule-based partial credit via keyword overlap with sampleAnswer.
        const ans = (answers[q.id] ?? '').toLowerCase();
        const keywords = (q.sampleAnswer ?? '').toLowerCase().split(/[,\s]+/).filter((w) => w.length > 3);
        const hit = keywords.filter((k) => ans.includes(k)).length;
        const isCorrect = keywords.length > 0 && hit / keywords.length >= 0.3;
        if (isCorrect) {
          correct += 1;
          skillMap[q.skill].correct += 1;
        }
      }
    }

    const skillBreakdown = Object.entries(skillMap).map(([skill, v]) => ({ skill, ...v }));
    const revisionAreas = skillBreakdown.filter((s) => s.correct / s.total < 0.5).map((s) => s.skill);

    const finalResult: AssessmentResult = {
      takenAt: new Date().toISOString(),
      totalQuestions: questions.length,
      correct,
      scorePercent: Math.round((correct / questions.length) * 100),
      skillBreakdown,
      revisionAreas,
    };
    setResult(finalResult);
    setSubmitted(true);
    showToast('Assessment submitted — readiness progress updated.', 'success');
  }

  function handleRetake() {
    setAnswers({});
    setMcqSelections({});
    setSubmitted(false);
    setResult(null);
  }

  if (submitted && result) {
    return (
      <div>
        <SectionHeading title="Assessment Results" description="Skill-wise breakdown and recommended revision areas." />
        <Card className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-mist-400">Score</p>
              <p className="font-display text-3xl font-semibold">{result.scorePercent}%</p>
              <p className="text-sm text-mist-400">{result.correct} / {result.totalQuestions} correct</p>
            </div>
            <Button variant="secondary" onClick={handleRetake}><RotateCcw size={14} /> Retake</Button>
          </div>
        </Card>
        <Card className="mb-5">
          <h3 className="mb-3 font-display text-base font-semibold">Skill-wise result</h3>
          <div className="flex flex-col gap-3">
            {result.skillBreakdown.map((s) => (
              <div key={s.skill}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-mist-100">{s.skill}</span>
                  <span className="text-mist-400">{s.correct}/{s.total}</span>
                </div>
                <ProgressBar value={(s.correct / s.total) * 100} tone={s.correct / s.total >= 0.5 ? 'teal' : 'coral'} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-display text-base font-semibold">Recommended revision areas</h3>
          {result.revisionAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.revisionAreas.map((r) => <Badge key={r} tone="coral">{r}</Badge>)}
            </div>
          ) : (
            <p className="text-sm text-mist-400">Strong performance across all assessed skills.</p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading title="Skill Assessment" description="Answer MCQ, coding, and scenario questions to update your readiness progress." />
      <div className="flex flex-col gap-5">
        {questions.map((q, i) => (
          <Card key={q.id}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-mist-400">Question {i + 1} · {q.skill}</p>
              <Badge tone={q.difficulty === 'Hard' ? 'coral' : q.difficulty === 'Medium' ? 'amber' : 'teal'}>{q.difficulty}</Badge>
            </div>
            <p className="mb-3 text-sm text-mist-100">{q.prompt}</p>
            {q.type === 'mcq' && q.options && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink-700 px-3 py-2 text-sm hover:border-signal-amber">
                    <input
                      type="radio"
                      name={q.id}
                      checked={mcqSelections[q.id] === idx}
                      onChange={() => setMcqSelections((prev) => ({ ...prev, [q.id]: idx }))}
                      className="accent-signal-amber"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {(q.type === 'coding' || q.type === 'scenario') && (
              <textarea
                rows={3}
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Type your answer…"
                className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
              />
            )}
          </Card>
        ))}
        <Button onClick={handleSubmit} className="self-start">
          <CheckCircle2 size={15} /> Submit assessment
        </Button>
      </div>
    </div>
  );
}
