import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, WifiOff } from 'lucide-react';
import { Card, SectionHeading, Badge, Button } from '@/components/ui/Primitives';
import { useAppState } from '@/context/AppStateContext';
import type { MentorMessage } from '@/types';
import { uid, cx } from '@/lib/utils';
import { generateFallbackMentorReply } from '@/lib/mentorFallback';
import { callChatCompletion, isLiveAIConfigured } from '@/lib/aiService';

const SUGGESTED_PROMPTS = [
  'How do I become a Data Analyst?',
  'What should I learn this week?',
  'Give me an interview question.',
  'Suggest a project based on my skills.',
  'Why is my employability score low?',
];

export function AIMentor() {
  const { profile, latestEmployability, roadmap, mentorMessages, addMentorMessage } = useAppState();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [mentorMessages]);

  if (!profile || !latestEmployability || !roadmap) return null;

  async function handleSend(text?: string) {
    const question = (text ?? input).trim();
    if (!question || isSending) return;
    setInput('');
    setIsSending(true);

    const userMsg: MentorMessage = { id: uid('msg'), role: 'user', content: question, isFallback: false, createdAt: new Date().toISOString() };
    addMentorMessage(userMsg);

    const ctx = { profile: profile!, employability: latestEmployability!, roadmap: roadmap! };

    if (isLiveAIConfigured()) {
      const systemPrompt = `You are an AI career mentor inside the HireVision AI prototype. The student's profile: ${JSON.stringify(
        profile,
      )}. Their employability score: ${latestEmployability!.score}/100. Their roadmap: ${JSON.stringify(
        roadmap!.weeks.map((w) => ({ title: w.title, objective: w.learningObjective })),
      )}. Answer their question concisely and specifically using this context.`;
      const result = await callChatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ]);
      const content = result.isFallback ? generateFallbackMentorReply(question, ctx) : result.content;
      addMentorMessage({ id: uid('msg'), role: 'assistant', content, isFallback: result.isFallback, createdAt: new Date().toISOString() });
    } else {
      const content = generateFallbackMentorReply(question, ctx);
      addMentorMessage({ id: uid('msg'), role: 'assistant', content, isFallback: true, createdAt: new Date().toISOString() });
    }
    setIsSending(false);
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <SectionHeading
        title="AI Mentor"
        description="Ask about your career path, this week's focus, interview prep, or your score. Answers are grounded in your own profile."
      />

      {!isLiveAIConfigured() && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-signal-amber/30 bg-signal-amber/5 px-3 py-2 text-sm text-signal-amber">
          <WifiOff size={15} /> No AI API key configured — running the Offline Mentor (deterministic, profile-grounded answers).
        </div>
      )}

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin px-5 py-4">
          {mentorMessages.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-mist-400">Try one of these to get started:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="rounded-full border border-ink-600 px-3 py-1.5 text-xs text-mist-300 hover:border-signal-amber hover:text-signal-amber"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {mentorMessages.map((msg) => (
            <div key={msg.id} className={cx('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
              <div className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', msg.role === 'user' ? 'bg-ink-700' : 'bg-signal-amber/15')}>
                {msg.role === 'user' ? <User size={16} className="text-mist-300" /> : <Bot size={16} className="text-signal-amber" />}
              </div>
              <div className={cx('max-w-[75%] rounded-xl2 px-4 py-2.5 text-sm', msg.role === 'user' ? 'bg-ink-700 text-mist-100' : 'bg-ink-900 text-mist-200 border border-ink-700')}>
                {msg.role === 'assistant' && msg.isFallback && (
                  <Badge tone="amber">Offline Mentor</Badge>
                )}
                <p className={msg.role === 'assistant' && msg.isFallback ? 'mt-2' : ''}>{msg.content}</p>
              </div>
            </div>
          ))}
          {isSending && <p className="text-sm text-mist-400">Mentor is thinking…</p>}
        </div>

        <form
          className="flex items-center gap-2 border-t border-ink-700 px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor anything about your career path…"
            className="flex-1 rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-mist-100 outline-none focus:border-signal-amber"
          />
          <Button type="submit" disabled={isSending || !input.trim()}>
            <Send size={15} />
          </Button>
        </form>
      </Card>
    </div>
  );
}
