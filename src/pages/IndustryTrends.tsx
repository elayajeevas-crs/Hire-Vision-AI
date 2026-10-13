import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, SectionHeading, Badge } from '@/components/ui/Primitives';
import { INDUSTRY_TRENDS } from '@/data/industryTrends';

export function IndustryTrends() {
  return (
    <div>
      <SectionHeading
        title="Industry Trend Monitor"
        description="Emerging skills and role-demand indicators."
      />
      <div className="mb-5 rounded-lg border border-signal-amber/30 bg-signal-amber/5 px-4 py-3 text-sm text-signal-amber">
        DEMO DATA — these indicators are illustrative and not connected to a live labor-market feed. Connect a real data source before treating this as current industry demand.
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {INDUSTRY_TRENDS.map((t) => (
          <Card key={t.skill}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">{t.skill}</h3>
              <div className="flex items-center gap-1">
                {t.trendPercent >= 0 ? <TrendingUp size={16} className="text-signal-teal" /> : <TrendingDown size={16} className="text-signal-coral" />}
                <span className={t.trendPercent >= 0 ? 'text-signal-teal' : 'text-signal-coral'}>
                  {t.trendPercent > 0 ? '+' : ''}{t.trendPercent}%
                </span>
              </div>
            </div>
            <Badge tone={t.roleDemand === 'Rising' ? 'teal' : t.roleDemand === 'Cooling' ? 'coral' : 'neutral'}>{t.roleDemand}</Badge>
            <p className="mt-3 text-sm text-mist-400"><span className="text-mist-300">Why this matters: </span>{t.whyItMatters}</p>
            <p className="mt-2 text-sm text-mist-300 border-t border-ink-700 pt-2">{t.suggestedAction}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
