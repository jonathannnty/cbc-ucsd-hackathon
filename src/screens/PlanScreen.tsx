'use client';

import { AppState } from '@/types';
import { PLAN_TASKS } from '@/data';
import { TaskRow, MeasurableProgress, TimeBoundCalendar } from '@/components/Tasks';

interface Props {
  state: AppState;
  onBack: () => void;
  onContinue: () => void;
}

export default function PlanScreen({ onBack, onContinue }: Props) {
  const completedCount = PLAN_TASKS.filter((t) => t.status === 'completed').length;
  const donePct = Math.round((completedCount / PLAN_TASKS.length) * 100);

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
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

        <div className="plan-grid">
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
              <div className="task-list">
                {PLAN_TASKS.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            </section>
          </div>

          <div className="section-stack">
            <MeasurableProgress
              pct={donePct}
              rows={[
                { label: 'Documents Verified', value: '5 / 8' },
                { label: 'Exam Prep Modules', value: '12 / 15' },
                { label: 'State Approvals', value: '1 / 4' },
              ]}
            />
            <TimeBoundCalendar month="October" year={2026} picked={15} deadlines={[22]} />
          </div>
        </div>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Save &amp; Continue</button>
        </div>
      </div>
    </div>
  );
}
