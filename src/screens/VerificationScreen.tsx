'use client';

import { useEffect, useRef, useState } from 'react';
import { AppState, Evaluator } from '@/types';
import { EvaluatorCard, HumanOversightDisclaimer } from '@/components/Cards';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { getValidIcon } from '@/utils/icons';

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

function parseEvaluators(text: string): Evaluator[] | null {
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) return parsed as Evaluator[];
  } catch { /* fall through */ }
  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed as Evaluator[];
    } catch { /* fall through */ }
  }
  return null;
}

function EvaluatorCardSkeleton() {
  return (
    <div className="evaluator-card" style={{ gap: 14 }}>
      <div className="skeleton-line" style={{ width: '40%', height: 20, borderRadius: 6 }} />
      <div className="skeleton-line" style={{ width: '60%', height: 16, borderRadius: 6 }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div className="skeleton-line" style={{ flex: 1, height: 40, borderRadius: 6 }} />
        <div className="skeleton-line" style={{ flex: 1, height: 40, borderRadius: 6 }} />
      </div>
      <div className="skeleton-line" style={{ width: '100%', height: 60, borderRadius: 6 }} />
      <div className="skeleton-line" style={{ width: '100%', height: 38, borderRadius: 8 }} />
    </div>
  );
}

export default function VerificationScreen({ state, update, onBack, onContinue }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(state.cachedEvaluators ? 'ready' : 'loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingEvaluatorIndex, setPendingEvaluatorIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const bufferRef = useRef('');
  const abortRef = useRef<AbortController | null>(null);

  const selectedPathway = state.pickedPathway !== null ? state.cachedPathways?.[state.pickedPathway] : null;

  function startFetch() {
    setStatus('loading');
    setErrorMsg(null);
    bufferRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;

    fetch('/api/evaluators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bufferRef.current += decoder.decode(value, { stream: true });
        }
        if (bufferRef.current.startsWith('__AGENT_ERROR__')) {
          throw new Error(bufferRef.current.slice(15));
        }
        const parsed = parseEvaluators(bufferRef.current);
        if (parsed && parsed.length > 0) {
          update({ cachedEvaluators: parsed, pickedEvaluator: null });
          setStatus('ready');
        } else {
          throw new Error('Could not parse evaluator recommendations.');
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErrorMsg(err.message ?? 'Unknown error');
          setStatus('error');
        }
      });
  }

  useEffect(() => {
    if (!state.cachedEvaluators) {
      startFetch();
    }
    return () => abortRef.current?.abort();
  }, []);

  const isLoading = status === 'loading';

  function handleEvaluatorSelect(index: number) {
    if (state.pickedEvaluator !== null && state.pickedEvaluator !== index) {
      setPendingEvaluatorIndex(index);
      setShowConfirmModal(true);
    } else {
      update({ pickedEvaluator: index });
    }
  }

  function confirmEvaluatorChange() {
    if (pendingEvaluatorIndex !== null) {
      update({ pickedEvaluator: pendingEvaluatorIndex });
      setPendingEvaluatorIndex(null);
      setShowConfirmModal(false);
    }
  }

  const handleSkip = () => {
    update({ pickedEvaluator: null });
    onContinue();
  };

  const handleBuildPlan = () => {
    if (state.pickedEvaluator !== null && state.cachedEvaluators) {
      const evaluator = state.cachedEvaluators[state.pickedEvaluator];
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
                {getValidIcon(selectedPathway.icon)}
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

        {status === 'error' ? (
          <div className="plan-summary" style={{ background: 'var(--error-container)', borderColor: 'var(--error)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-error-container)', flexShrink: 0 }}>
              error
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Could not generate evaluator recommendations</p>
              <p style={{ margin: '4px 0 10px', fontSize: 14, color: 'var(--on-surface-variant)' }}>{errorMsg}</p>
              <button className="btn-outline" onClick={startFetch} style={{ fontSize: 14 }}>Try Again</button>
            </div>
          </div>
        ) : (
          <div className="evaluator-grid">
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => <EvaluatorCardSkeleton key={i} />)
              : (state.cachedEvaluators ?? []).map((e, i) => (
                  <EvaluatorCard
                    key={e.name}
                    {...e}
                    selected={state.pickedEvaluator === i}
                    onSelect={() => handleEvaluatorSelect(i)}
                  />
                ))
            }
          </div>
        )}

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
              disabled={isLoading || state.pickedEvaluator === null}
            >
              Visit Evaluator &amp; Continue
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          title="Change Evaluator?"
          message="Changing your evaluator selection will update your SMART plan recommendations. Are you sure you want to switch?"
          onConfirm={confirmEvaluatorChange}
          onCancel={() => {
            setShowConfirmModal(false);
            setPendingEvaluatorIndex(null);
          }}
          confirmLabel="Yes, Change It"
          cancelLabel="Keep Current"
        />
      )}

      {showModal && state.cachedEvaluators && state.pickedEvaluator !== null && (
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
              <b>{state.cachedEvaluators[state.pickedEvaluator].name}</b>,
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
