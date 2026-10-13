import { describe, expect, it } from 'vitest';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

describe('supabase client bootstrap', () => {
  it('returns a disabled state when no runtime credentials are configured', () => {
    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseClient()).toBeNull();
  });
});
