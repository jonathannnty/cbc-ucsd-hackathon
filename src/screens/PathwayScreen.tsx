'use client';

import { AppState } from '@/types';
import { PATHWAYS } from '@/data';
import { PathwayCard } from '@/components/Cards';

const PROFESSION_LABELS: Record<string, string> = {
  doctor:    'Doctor / Physician',
  nurse:     'Registered Nurse',
  engineer:  'Civil / Mechanical Engineer',
  teacher:   'Primary / Secondary Teacher',
  architect: 'Architect',
  other:     'Other Professional',
};

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function PathwayScreen({ state, update, onBack, onContinue }: Props) {
  const profLabel =
    state.profession === 'other' && state.otherProfession
      ? state.otherProfession
      : PROFESSION_LABELS[state.profession] ?? 'Professional';

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <div className="tag-row">
            <span className="pill tag-primary">{profLabel}</span>
            <span className="pill">Budget: ${state.budget.toLocaleString()}</span>
            <span className="pill">Time: {state.months} Months</span>
          </div>
          <h1 className="display">Matching Your Situation</h1>
          <p className="lead">
            Based on your profile, we have identified bridge roles and career steps that honor your
            expertise while fitting within your constraints.
          </p>
        </div>

        <div className="pathway-grid">
          {PATHWAYS.map((p, i) => (
            <PathwayCard
              key={p.title}
              {...p}
              selected={state.pickedPathway === i}
              onSelect={() => update({ pickedPathway: i })}
            />
          ))}
        </div>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Continue to Verification</button>
        </div>
      </div>
    </div>
  );
}
