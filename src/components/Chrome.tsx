'use client';

import { Screen } from '@/types';

const STEPS: { id: Screen; label: string; icon: string }[] = [
  { id: 'identity',     label: 'Identity',     icon: 'person' },
  { id: 'education',    label: 'Education',    icon: 'school' },
  { id: 'documents',    label: 'Documents',    icon: 'description' },
  { id: 'budget',       label: 'Budget',       icon: 'savings' },
  { id: 'pathway',      label: 'Pathway',      icon: 'route' },
  { id: 'verification', label: 'Verification', icon: 'verified' },
  { id: 'plan',         label: 'SMART Plan',   icon: 'assignment_turned_in' },
  { id: 'complete',     label: 'Complete',     icon: 'check_circle' },
];

export function TopNavBar() {
  return (
    <header className="topnav">
      <div className="topnav-brand">
        <span className="wordmark">CertConvert</span>
      </div>

    </header>
  );
}

interface StepperProps {
  activeId: Screen;
  completedIds: Screen[];
  onNavigate: (screen: Screen) => void;
}

export function JourneyStepper({ activeId, completedIds, onNavigate }: StepperProps) {
  return (
    <aside className="stepper">
      <div className="stepper-head">
        <div className="stepper-mark">
          <span className="material-symbols-outlined">route</span>
        </div>
        <div>
          <h2>Your Journey</h2>
          <p>8 Steps to Success</p>
        </div>
      </div>
      <nav>
        {STEPS.map((s) => {
          const done = completedIds.includes(s.id);
          const active = s.id === activeId;
          const clickable = done && !active;
          const cls = active ? 'step active' : done ? 'step done' : 'step upcoming';
          return (
            <button
              key={s.id}
              className={cls}
              onClick={clickable ? () => onNavigate(s.id) : undefined}
              style={clickable ? { cursor: 'pointer' } : { cursor: 'default' }}
              type="button"
            >
              <span
                className="material-symbols-outlined"
                style={done && !active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {done && !active ? 'check_circle' : s.icon}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export function WhyDoWeNeedThis({ children }: { children: React.ReactNode }) {
  return (
    <div className="why-block">
      <span
        className="material-symbols-outlined"
        style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1", flexShrink: 0 }}
      >
        info
      </span>
      <div>
        <p className="why-title">Why do we need this?</p>
        <p className="why-body">{children}</p>
      </div>
    </div>
  );
}
