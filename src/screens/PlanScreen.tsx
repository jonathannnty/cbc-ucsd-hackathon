'use client';

import { useEffect, useRef, useState } from 'react';
import { AppState, AgentPlan } from '@/types';
import { TaskRow, MeasurableProgress, TimeBoundCalendar } from '@/components/Tasks';
import {
  PlanSummary,
  KeyResources,
  RoadblocksList,
  BudgetBreakdown,
  TaskListSkeleton,
  ProgressSkeleton,
  GenericCardSkeleton,
} from '@/components/Plan';

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

function parseAgentPlan(text: string): AgentPlan | null {
  try {
    return JSON.parse(text.trim()) as AgentPlan;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]) as AgentPlan; } catch { /* fall through */ }
    }
    return null;
  }
}

export default function PlanScreen({ state, update, onBack, onContinue }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(state.cachedPlan ? 'ready' : 'loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bufferRef = useRef('');
  const abortRef = useRef<AbortController | null>(null);

  function startFetch() {
    setStatus('loading');
    setErrorMsg(null);
    bufferRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;

    fetch('/api/agent', {
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
        const parsed = parseAgentPlan(bufferRef.current);
        if (parsed) {
          update({ cachedPlan: parsed });
          setStatus('ready');
        } else {
          throw new Error('Could not parse agent response.');
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
    if (!state.cachedPlan) {
      startFetch();
    }
    return () => abortRef.current?.abort();
  }, []);

  const isLoading = status === 'loading';

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span className="eyebrow">Strategy Phase</span>
            <h1 className="display">SMART Recertification Plan</h1>
            <p className="lead">
              Your structured roadmap for the next 90 days. We&rsquo;ve broken down your credential
              recertification into actionable, measurable steps.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-outline" onClick={() => window.print()}>
              <span className="material-symbols-outlined">print</span>
              Print PDF
            </button>
          </div>
        </div>

        {/* Summary banner */}
        {isLoading ? (
          <div className="plan-summary plan-summary-skeleton">
            <div className="skeleton-line" style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton-line" style={{ width: '80%', marginBottom: 6 }} />
              <div className="skeleton-line" style={{ width: '55%' }} />
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="plan-summary" style={{ background: 'var(--error-container)', borderColor: 'var(--error)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-error-container)', flexShrink: 0 }}>
              error
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>Could not generate your plan</p>
              <p style={{ margin: '4px 0 10px', fontSize: 14, color: 'var(--on-surface-variant)' }}>{errorMsg}</p>
              <button className="btn-outline" onClick={startFetch} style={{ fontSize: 14 }}>Try Again</button>
            </div>
          </div>
        ) : state.cachedPlan ? (
          <PlanSummary summary={state.cachedPlan.summary} />
        ) : null}

        {/* Main two-column grid */}
        <div className="plan-grid">
          {/* Left: Specific Tasks */}
          <div className="section-stack">
            <section className="card">
              <div className="card-head" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      background: 'var(--primary-container)',
                      color: 'var(--on-primary-container)',
                      padding: 6,
                      borderRadius: 8,
                    }}
                  >
                    checklist
                  </span>
                  <h3>Specific Tasks</h3>
                </div>
              </div>
              {isLoading ? (
                <TaskListSkeleton />
              ) : state.cachedPlan ? (
                <div className="task-list">
                  {state.cachedPlan.tasks.map((t, i) => (
                    <TaskRow key={i} task={{ ...t, id: i + 1 }} />
                  ))}
                </div>
              ) : null}
            </section>
          </div>

          {/* Right: Progress + Calendar */}
          <div className="section-stack">
            {isLoading ? (
              <section className="card">
                <div className="card-head">
                  <h3>Measurable Progress</h3>
                  <span className="pct">—</span>
                </div>
                <ProgressSkeleton />
              </section>
            ) : state.cachedPlan ? (
              <MeasurableProgress pct={state.cachedPlan.progressPct} rows={state.cachedPlan.progress} />
            ) : null}
            <TimeBoundCalendar month="October" year={2026} picked={15} deadlines={[22]} />
          </div>
        </div>

        {/* Insights: Resources + Roadblocks */}
        <div className="plan-grid">
          {isLoading ? (
            <>
              <GenericCardSkeleton lines={5} />
              <GenericCardSkeleton lines={4} />
            </>
          ) : state.cachedPlan ? (
            <>
              <KeyResources resources={state.cachedPlan.resources} />
              <RoadblocksList roadblocks={state.cachedPlan.roadblocks} />
            </>
          ) : null}
        </div>

        {/* Budget — full width */}
        {isLoading ? (
          <GenericCardSkeleton lines={6} />
        ) : state.cachedPlan ? (
          <BudgetBreakdown budget={state.cachedPlan.budget} />
        ) : null}

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue} disabled={isLoading}>
            Save &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
