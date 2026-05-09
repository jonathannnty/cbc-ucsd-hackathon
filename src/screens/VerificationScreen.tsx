'use client';

import { useState } from 'react';
import { AppState } from '@/types';
import { EVALUATORS, PATHWAYS } from '@/data';
import { EvaluatorCard, HumanOversightDisclaimer } from '@/components/Cards';

const EVALUATOR_URLS: Record<string, string> = {
  'Josef Silny': 'https://www.jsilny.org',
  'WES': 'https://www.wes.org',
  'ECFMG': 'https://www.ecfmg.org',
};

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function VerificationScreen({ state, update, onBack, onContinue }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [confirmedEvaluation, setConfirmedEvaluation] = useState(false);

  const selectedPathway = state.pickedPathway !== null ? PATHWAYS[state.pickedPathway] : null;

  const handleSkip = () => {
    update({ pickedEvaluator: null });
    onContinue();
  };

  const handleBuildPlan = () => {
    if (state.pickedEvaluator !== null) {
      const evaluator = EVALUATORS[state.pickedEvaluator];
      const url = EVALUATOR_URLS[evaluator.name];
      if (url) {
        window.open(url, '_blank');
      }
      setShowModal(true);
    } else {
      onContinue();
    }
  };

  const handleModalConfirm = () => {
    setConfirmedEvaluation(true);
    setShowModal(false);
    onContinue();
  };

  const handleModalSkip = () => {
    setShowModal(false);
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

        {selectedPathway && (
          <div className="pathway-summary-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                className="material-symbols-outlined"
                style={{
                  padding: 8,
                  background: 'var(--primary-fixed)',
                  color: 'var(--primary)',
                  borderRadius: 8,
                  fontSize: 24,
                }}
              >
                {selectedPathway.icon}
              </span>
              <div>
                <h3 style={{ margin: 0, font: '600 18px/1.3 var(--font-display)' }}>
                  {selectedPathway.title}
                </h3>
                <p style={{ margin: 0, font: '400 13px/1.4 var(--font-body)', color: 'var(--on-surface-variant)' }}>
                  Your selected pathway
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div className="kv" style={{ fontSize: 13, gap: 4 }}>
                <span>Time</span><b>{selectedPathway.time}</b>
              </div>
              <div className="kv" style={{ fontSize: 13, gap: 4 }}>
                <span>Cost</span><b>{selectedPathway.cost}</b>
              </div>
              <div className="kv" style={{ fontSize: 13, gap: 4 }}>
                <span>Confidence</span><b>{selectedPathway.confidence}%</b>
              </div>
            </div>
          </div>
        )}

        <div className="naces-explanation">
          <span
            className="material-symbols-outlined"
            style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1", flexShrink: 0, fontSize: 24 }}
          >
            warning
          </span>
          <div>
            <p style={{ margin: '0 0 4px', font: '600 14px/1.4 var(--font-body)', color: 'var(--primary)' }}>
              Why get an independent evaluation?
            </p>
            <p style={{ margin: 0, font: '400 14px/1.6 var(--font-body)', color: 'var(--on-surface-variant)' }}>
              Pathfinder provides our best assessment of your credentials, but we could be wrong.
              A NACES-approved evaluator provides an official, independent review that is recognized
              by US employers, licensing boards, and universities. We strongly recommend getting an
              independent evaluation to confirm your pathway — we&rsquo;d hate to steer you in the
              wrong direction should our advice be inaccurate.
            </p>
          </div>
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

        <HumanOversightDisclaimer />

        <div className="row-actions" style={{ justifyContent: 'space-between' }}>
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn-text-link" onClick={handleSkip}>
              Skip — I&rsquo;ll arrange evaluation later
            </button>
            <button
              className="btn-primary"
              onClick={handleBuildPlan}
              disabled={state.pickedEvaluator === null}
            >
              Visit Evaluator &amp; Continue
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 48, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}
              >
                fact_check
              </span>
            </div>
            <h2 style={{ margin: '12px 0 8px', font: '600 22px/1.3 var(--font-display)', color: 'var(--primary)', textAlign: 'center' }}>
              Have you arranged your evaluation?
            </h2>
            <p style={{ margin: '0 0 24px', font: '400 15px/1.6 var(--font-body)', color: 'var(--on-surface-variant)', textAlign: 'center' }}>
              If you&rsquo;ve started the evaluation process with{' '}
              <b>{state.pickedEvaluator !== null ? EVALUATORS[state.pickedEvaluator].name : ''}</b>,
              confirm below to proceed to your SMART plan.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn-primary" onClick={handleModalConfirm} style={{ width: '100%', justifyContent: 'center' }}>
                Yes, I&rsquo;ve Arranged Evaluation
              </button>
              <button className="btn-text-link" onClick={handleModalSkip} style={{ textAlign: 'center' }}>
                Skip — I&rsquo;ll arrange evaluation later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
