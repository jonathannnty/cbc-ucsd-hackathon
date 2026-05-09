'use client';

import { AppState } from '@/types';
import { EVALUATORS } from '@/data';
import { EvaluatorCard, HumanOversightDisclaimer } from '@/components/Cards';

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function VerificationScreen({ state, update, onBack, onContinue }: Props) {
  const handleSkip = () => {
    update({ pickedEvaluator: null });
    onContinue();
  };

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 6 of 8 · NACES</span>
          <h1 className="display">NACES Evaluator Picker</h1>
          <p className="lead">
            Compare approved NACES member organizations to find the best fit for your specific
            professional and academic requirements.
          </p>
        </div>

        <div className="evaluator-grid">
          {EVALUATORS.map((e, i) => (
            <EvaluatorCard
              key={e.name}
              {...e}
              selected={state.pickedEvaluator === i}
              onSelect={() => update({ pickedEvaluator: i })}
            />
          ))}
        </div>

        <div className="skip-evaluation">
          <button className="btn-text-link" onClick={handleSkip}>
            Skip — I&rsquo;ll arrange evaluation later
          </button>
        </div>

        <HumanOversightDisclaimer />

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Build My SMART Plan</button>
        </div>
      </div>
    </div>
  );
}
