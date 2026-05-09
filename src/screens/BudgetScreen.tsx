'use client';

import { AppState } from '@/types';
import { WhyDoWeNeedThis } from '@/components/Chrome';

interface SliderWithInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  parse: (s: string) => number;
  onChange: (v: number) => void;
  inputSuffix?: string;
}

function SliderWithInput({
  label, value, min, max, step, format, parse, onChange, inputSuffix,
}: SliderWithInputProps) {
  const pct = ((Math.min(value, max) - min) / (max - min)) * 100;
  const displayValue = format(value);

  const handleTextChange = (raw: string) => {
    const parsed = parse(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    }
  };

  return (
    <div className="slider-group">
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <div className="slider-input-wrap">
          <input
            type="text"
            className="slider-text-input"
            value={displayValue}
            onChange={(e) => handleTextChange(e.target.value)}
            style={{ width: Math.max(60, displayValue.length * 14) }}
          />
          {inputSuffix && <span className="slider-input-suffix">{inputSuffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': pct + '%' } as React.CSSProperties}
      />
    </div>
  );
}

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
          <SliderWithInput
            label="Money you can invest"
            value={state.budget}
            min={0}
            max={20000}
            step={500}
            format={(v) => '$' + v.toLocaleString()}
            parse={(s) => {
              const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
              return isNaN(n) ? 0 : n;
            }}
            onChange={(v) => update({ budget: v })}
          />
          <SliderWithInput
            label="Time you can commit"
            value={state.months}
            min={3}
            max={60}
            step={1}
            format={(v) => String(v)}
            parse={(s) => {
              const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
              return isNaN(n) ? 3 : n;
            }}
            onChange={(v) => update({ months: v })}
            inputSuffix=" Months"
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
