import React, { useState } from 'react';
import { Mic2, Send, WifiOff } from 'lucide-react';
import { Card, SectionHeading, Badge, Button, ProgressBar } from '@/components/ui/Primitives';
import { getInterviewQuestions } from '@/data/interviewBank';
import { generateFallbackFeedback, type InterviewFeedback } from '@/lib/interviewFeedback';
import { callChatCompletion, isLiveAIConfigured } from '@/lib/aiService';
import type { InterviewQuestion } from '@/types';

export function InterviewPrep() {
  const questions = getInterviewQuestions();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [aiFeedbackText, setAiFeedbackText] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const active: InterviewQuestion | undefined = questions.find((q) => q.id === activeId);

  function startInterview(q: InterviewQuestion) {
    setActiveId(q.id);
    setAnswer('');
    setFeedback(null);
    setAiFeedbackText(null);
  }

  async function submitAnswer() {
    if (!active || !answer.trim()) return;
    setIsEvaluating(true);
    if (isLiveAIConfigured()) {
      const result = await callChatCompletion([
        { role: 'system', content: 'You are an interview coach. Give concise, constructive feedback (3-4 sentences) on the candidate answer, referencing what was covered well and what to add.' },
        { role: 'user', content: `Question: ${active.question}\nAnswer: ${answer}` },
      ]);
      if (result.isFallback) {
        setFeedback(generateFallbackFeedback(active, answer));
      } else {
        setAiFeedbackText(result.content);
      }
    } else {
      setFeedback(generateFallbackFeedback(active, answer));
    }
    setIsEvaluating(false);
  }

  return (
    <div>
      <SectionHeading
        title="Interview Preparation"
        description="Technical, HR, and role-specific questions with instant feedback on your answers."
      />

      {!active ? (
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((q) => (
            <Card key={q.id}>
              <div className="mb-2 flex items-center justify-between">
                <Badge>{q.category}</Badge>
                <Badge tone={q.difficulty === 'Hard' ? 'coral' : q.difficulty === 'Medium' ? 'amber' : 'teal'}>{q.difficulty}</Badge>
              </div>
              <p className="text-sm text-mist-100">{q.question}</p>
              <Button variant="secondary" className="mt-4" onClick={() => startInterview(q)}>
                <Mic2 size={14} /> Start interview
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <Badge>{active.category}</Badge>
            <Badge tone={active.difficulty === 'Hard' ? 'coral' : active.difficulty === 'Medium' ? 'amber' : 'teal'}>{active.difficulty}</Badge>
          </div>
          <p className="mb-4 font-display text-lg font-semibold">{active.question}</p>

          {!isLiveAIConfigured() && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-signal-amber/30 bg-signal-amber/5 px-3 py-2 text-xs text-signal-amber">
              <WifiOff size={13} /> No AI key configured — feedback uses the rule-based Offline Coach.
            </div>
          )}

          <textarea
            rows={5}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer as you would say it out loud…"
            className="w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
          />
          <div className="mt-3 flex gap-3">
            <Button onClick={submitAnswer} disabled={isEvaluating || !answer.trim()}>
              <Send size={14} /> {isEvaluating ? 'Evaluating…' : 'Get feedback'}
            </Button>
            <Button variant="ghost" onClick={() => setActiveId(null)}>Back to questions</Button>
          </div>

          {aiFeedbackText && (
            <div className="mt-5 rounded-lg border border-ink-700 bg-ink-900 p-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-mist-400">AI Feedback</p>
              <p className="text-sm text-mist-200">{aiFeedbackText}</p>
            </div>
          )}

          {feedback && (
            <div className="mt-5 rounded-lg border border-ink-700 bg-ink-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-mist-400">Offline Coach Feedback</p>
                <Badge tone="amber">Rule-based</Badge>
              </div>
              <ProgressBar value={feedback.score} tone={feedback.score >= 60 ? 'teal' : 'coral'} />
              <p className="mt-2 text-sm text-mist-200">{feedback.advice}</p>
              {feedback.matchedPoints.length > 0 && (
                <p className="mt-2 text-xs text-signal-teal">Covered: {feedback.matchedPoints.join(', ')}</p>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
