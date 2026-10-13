// AI service abstraction.
//
// If VITE_AI_API_KEY / VITE_AI_BASE_URL are configured, this module calls
// an OpenAI-compatible /chat/completions endpoint. If not (the default
// for this hackathon prototype), every call transparently resolves to
// the deterministic fallback engines in mentorFallback.ts /
// interviewFeedback.ts, and callers are told isFallback: true so the UI
// can label the response as Offline/Demo AI.
//
// To swap providers later: change VITE_AI_BASE_URL / VITE_AI_MODEL, or
// replace callChatCompletion's fetch call with your provider's SDK.

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;
const AI_BASE_URL = (import.meta.env.VITE_AI_BASE_URL as string | undefined) || 'https://api.openai.com/v1';
const AI_MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) || 'gpt-4o-mini';

export function isLiveAIConfigured(): boolean {
  return Boolean(AI_API_KEY && AI_API_KEY.trim().length > 0);
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICallResult {
  content: string;
  isFallback: boolean;
  error?: string;
}

/**
 * Calls an OpenAI-compatible chat completion endpoint. Never throws:
 * on any failure (missing key, network error, non-2xx response) it
 * returns isFallback: true with an error message so the caller can
 * fall back to a deterministic response instead of crashing the app.
 */
export async function callChatCompletion(messages: ChatMessage[]): Promise<AICallResult> {
  if (!isLiveAIConfigured()) {
    return { content: '', isFallback: true, error: 'No AI API key configured — using offline mentor.' };
  }

  try {
    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return { content: '', isFallback: true, error: `AI request failed (${response.status})` };
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      return { content: '', isFallback: true, error: 'AI response was empty.' };
    }
    return { content, isFallback: false };
  } catch (err) {
    return { content: '', isFallback: true, error: err instanceof Error ? err.message : 'Unknown AI error' };
  }
}
