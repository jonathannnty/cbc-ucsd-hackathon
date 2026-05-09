'use client';

import { AppState } from '@/types';
import { RangeSlider } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function BudgetScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack">
        <div>
          <span className="eyebrow">Step 4 of 8</span>
          <h1 className="display">Your Time &amp; Money Budget</h1>
          <p className="lead">
            We&rsquo;ll show pathways that fit your real constraints — not the theoretical fastest
            route.
          </p>
        </div>

        <div className="card" style={{ padding: 32, gap: 32 }}>
          <RangeSlider
            label="Money you can invest"
            value={state.budget}
            min={0}
            max={20000}
            step={500}
            onChange={(v) => update({ budget: v })}
            format={(v) => '$' + v.toLocaleString()}
          />
          <RangeSlider
            label="Time you can commit"
            value={state.months}
            min={3}
            max={60}
            step={1}
            onChange={(v) => update({ months: v })}
            format={(v) => v + ' Months'}
          />
        </div>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Find My Pathways</button>
        </div>
      </div>

      <WhyDoWeNeedThis>
        We present cost and time as ranges, with the assumptions stated. If your budget makes the
        standard route unrealistic, we&rsquo;ll show you adjacent bridge roles.
      </WhyDoWeNeedThis>
    </div>
  );
}
