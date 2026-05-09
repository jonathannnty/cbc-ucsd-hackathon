'use client';

import { AgentPlan } from '@/types';

// ── Skeleton helpers ─────────────────────────────────────────────────────────

function SkeletonLine({ w = '100%', h = 13 }: { w?: string; h?: number }) {
  return (
    <div
      className="skeleton-line"
      style={{ width: w, height: h, borderRadius: 4, marginBottom: 6 }}
    />
  );
}

export function TaskListSkeleton() {
  return (
    <div className="task-list">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="task-row"
          style={{ gap: 14, alignItems: 'flex-start', padding: 14 }}
        >
          <div
            className="skeleton-line"
            style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, marginTop: 4 }}
          />
          <div style={{ flex: 1 }}>
            <SkeletonLine w="55%" h={14} />
            <SkeletonLine w="85%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <>
      <div className="bar">
        <i style={{ width: '0%' }} />
      </div>
      <div className="kv-stack">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="kv-row" style={{ alignItems: 'center' }}>
            <SkeletonLine w="55%" h={12} />
            <SkeletonLine w="22%" h={12} />
          </div>
        ))}
      </div>
    </>
  );
}

export function GenericCardSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <section className="card">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} w={i === 0 ? '45%' : i % 3 === 0 ? '70%' : '100%'} />
      ))}
    </section>
  );
}

// ── Summary banner ───────────────────────────────────────────────────────────

export function PlanSummary({ summary }: { summary: string }) {
  return (
    <div className="plan-summary">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 22, color: 'var(--secondary)', flexShrink: 0, marginTop: 1 }}
      >
        lightbulb
      </span>
      <p>{summary}</p>
    </div>
  );
}

// ── Key Resources ────────────────────────────────────────────────────────────

export function KeyResources({ resources }: { resources: AgentPlan['resources'] }) {
  return (
    <section className="card">
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            className="material-symbols-outlined"
            style={{
              background: 'var(--secondary-container)',
              color: 'var(--on-secondary-container)',
              padding: 6,
              borderRadius: 8,
            }}
          >
            link
          </span>
          <h3>Key Resources</h3>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {resources.map((r, i) => (
          <div key={i} className="resource-row">
            <span
              className="material-symbols-outlined resource-icon"
              aria-hidden="true"
            >
              {r.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="resource-name">{r.name}</p>
              <p className="resource-contact">{r.contact}</p>
              <p className="resource-desc">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Roadblocks ───────────────────────────────────────────────────────────────

export function RoadblocksList({ roadblocks }: { roadblocks: AgentPlan['roadblocks'] }) {
  return (
    <section className="card">
      <div className="card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            className="material-symbols-outlined"
            style={{
              background: 'var(--error-container)',
              color: 'var(--on-error-container)',
              padding: 6,
              borderRadius: 8,
            }}
          >
            warning
          </span>
          <h3>Potential Challenges</h3>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {roadblocks.map((r, i) => (
          <div key={i} className="roadblock-item">
            <p className="roadblock-challenge">{r.challenge}</p>
            <p className="roadblock-solution">
              <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>How to address it: </span>
              {r.solution}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Budget Breakdown ─────────────────────────────────────────────────────────

export function BudgetBreakdown({ budget }: { budget: AgentPlan['budget'] }) {
  return (
    <section className="card">
      <div className="card-head">
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
            payments
          </span>
          <h3>Budget Breakdown</h3>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {budget.map((b, i) => (
          <div key={i} className="budget-row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="budget-phase">{b.phase}</p>
              <p className="budget-desc">{b.desc}</p>
            </div>
            <b className="budget-cost">{b.cost}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
