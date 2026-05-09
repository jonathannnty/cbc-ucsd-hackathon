'use client';

import { useEffect, useRef, useState } from 'react';
import { AppState, Pathway } from '@/types';
import { PathwayCard } from '@/components/Cards';
import { ConfirmationModal } from '@/components/ConfirmationModal';

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

function parsePathways(text: string): Pathway[] | null {
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) return parsed as Pathway[];
  } catch { /* fall through */ }
  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed as Pathway[];
    } catch { /* fall through */ }
  }
  return null;
}

function PathwayCardSkeleton() {
  return (
    <div className="pathway-card" style={{ gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="skeleton-line" style={{ width: 40, height: 40, borderRadius: 10 }} />
      </div>
      <div className="skeleton-line" style={{ width: '65%', height: 20, borderRadius: 6 }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <div className="skeleton-line" style={{ flex: 1, height: 44, borderRadius: 8 }} />
        <div className="skeleton-line" style={{ flex: 1, height: 44, borderRadius: 8 }} />
        <div className="skeleton-line" style={{ flex: 1, height: 44, borderRadius: 8 }} />
      </div>
      <div className="skeleton-line" style={{ width: '100%', height: 48, borderRadius: 6 }} />
      <div className="skeleton-line" style={{ width: '100%', height: 38, borderRadius: 8, marginTop: 4 }} />
    </div>
  );
}

export default function PathwayScreen({ state, update, onBack, onContinue }: Props) {
  const [pathways, setPathways] = useState<Pathway[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingPathwayIndex, setPendingPathwayIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const bufferRef = useRef('');
  const abortRef = useRef<AbortController | null>(null);
  const initialFetchRef = useRef(true);

  const profLabel =
    state.profession === 'other' && state.otherProfession
      ? state.otherProfession
      : PROFESSION_LABELS[state.profession] ?? 'Professional';

  function startFetch() {
    setStatus('loading');
    setErrorMsg(null);
    bufferRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;

    fetch('/api/pathways', {
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
        const parsed = parsePathways(bufferRef.current);
        if (parsed && parsed.length > 0) {
          setPathways(parsed);
          if (initialFetchRef.current) {
            update({ pickedPathway: null });
            initialFetchRef.current = false;
          }
          setStatus('ready');
        } else {
          throw new Error('Could not parse pathway recommendations.');
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
    startFetch();
    return () => abortRef.current?.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = status === 'loading';

  function handlePathwaySelect(index: number) {
    if (state.pickedPathway !== null && state.pickedPathway !== index) {
      setPendingPathwayIndex(index);
      setShowConfirmModal(true);
    } else {
      update({ pickedPathway: index });
    }
  }

  function confirmPathwayChange() {
    if (pendingPathwayIndex !== null) {
      update({ pickedPathway: pendingPathwayIndex });
      setPendingPathwayIndex(null);
      setShowConfirmModal(false);
    }
  }

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

        {status === 'error' ? (
          <div className="plan-summary" style={{ background: 'var(--error-container)', borderColor: 'var(--error)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-error-container)', flexShrink: 0 }}>
              error
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Could not generate pathway recommendations</p>
              <p style={{ margin: '4px 0 10px', fontSize: 14, color: 'var(--on-surface-variant)' }}>{errorMsg}</p>
              <button className="btn-outline" onClick={startFetch} style={{ fontSize: 14 }}>Try Again</button>
            </div>
          </div>
        ) : (
          <div className="pathway-grid">
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => <PathwayCardSkeleton key={i} />)
              : (pathways ?? []).map((p, i) => (
                  <PathwayCard
                    key={p.title}
                    {...p}
                    selected={state.pickedPathway === i}
                    onSelect={() => handlePathwaySelect(i)}
                  />
                ))
            }
          </div>
        )}

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button
            className="btn-primary"
            onClick={onContinue}
            disabled={isLoading || state.pickedPathway === null}
          >
            Continue to Verification
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmationModal
          title="Change Pathway?"
          message="Changing your pathway selection will generate a new SMART plan. Your previously saved information will be updated. Are you sure?"
          onConfirm={confirmPathwayChange}
          onCancel={() => {
            setShowConfirmModal(false);
            setPendingPathwayIndex(null);
          }}
          confirmLabel="Yes, Change It"
          cancelLabel="Keep Current"
        />
      )}
    </div>
  );
}
