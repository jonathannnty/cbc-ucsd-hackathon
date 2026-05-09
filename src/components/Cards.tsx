'use client';

import { Pathway, Evaluator } from '@/types';

export function ConfidenceBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  return (
    <span className={`pill conf-${level.toLowerCase()}`}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}
      >
        check_circle
      </span>
      Confidence: {level}
    </span>
  );
}

export function StatusPill({ kind, children }: { kind: string; children: React.ReactNode }) {
  return <span className={`pill status-${kind}`}>{children}</span>;
}

interface PathwayCardProps extends Pathway {
  selected: boolean;
  onSelect: () => void;
}

export function PathwayCard({
  icon, title, time, cost, desc, confidence, recommended, selected, onSelect,
}: PathwayCardProps) {
  const highlight = recommended && selected;
  return (
    <div className={`pathway-card${highlight ? ' recommended' : ''}`}>
      {recommended && <span className="recommended-chip">Recommended</span>}
      <div className="pathway-top">
        <span className="pathway-icon material-symbols-outlined">{icon}</span>
        <ConfidenceBadge level={confidence} />
      </div>
      <h3>{title}</h3>
      <div className="pathway-stats">
        <div className="kv"><span>Time</span><b>{time}</b></div>
        <div className="kv"><span>Cost</span><b>{cost}</b></div>
      </div>
      <p className="pathway-desc">{desc}</p>
      <button
        className={highlight ? 'btn-on-primary' : 'btn-tonal'}
        onClick={onSelect}
      >
        {selected ? 'Selected ✓' : recommended ? 'Start Enrollment' : 'Select Path'}
      </button>
    </div>
  );
}

interface EvaluatorCardProps extends Evaluator {
  selected: boolean;
  onSelect: () => void;
}

export function EvaluatorCard({
  ribbon, name, subtitle, metric, metricLabel, bullets, selected, onSelect,
}: EvaluatorCardProps) {
  return (
    <div className={`evaluator-card${selected ? ' selected' : ''}`}>
      {ribbon && (
        <span className="evaluator-ribbon">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{ribbon.icon}</span>
          {ribbon.label}
        </span>
      )}
      <h3>{name}</h3>
      <p className="evaluator-sub">{subtitle}</p>
      <div className="evaluator-metric">
        <span>{metricLabel}</span>
        <b>{metric}</b>
      </div>
      <ul>
        {bullets.map((b, i) => (
          <li key={i}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, color: selected ? '#fff' : 'var(--secondary)', flexShrink: 0 }}
            >
              {selected ? 'verified' : 'check_circle'}
            </span>
            {b}
          </li>
        ))}
      </ul>
      <button
        className={selected ? 'btn-on-primary' : 'btn-primary'}
        onClick={onSelect}
      >
        {selected ? 'Selected ✓' : 'Select'}
      </button>
    </div>
  );
}

export function SpecialistCard() {
  return (
    <div className="specialist-card">
      <h4>Need Clarification?</h4>
      <p>Your case manager, Marcus, is available for a 15-minute check-in call.</p>
      <div className="specialist-row">
        <div className="avatar-lg">MT</div>
        <div>
          <p className="specialist-name">Marcus Thorne</p>
          <p className="specialist-role">Licensing Specialist</p>
        </div>
      </div>
      <button className="btn-primary">Schedule Call</button>
    </div>
  );
}

export function HumanOversightDisclaimer() {
  return (
    <div className="oversight">
      <div className="oversight-icon">
        <span className="material-symbols-outlined">psychology</span>
      </div>
      <div className="oversight-body">
        <h4>Human Oversight Disclaimer</h4>
        <p>
          Pathfinder provides these comparisons based on current data. Each credentialing case is
          unique. We strongly recommend a final review with a Pathfinder advisor before committing.
        </p>
      </div>
      <button className="btn-outline btn-outline-strong">Talk to Advisor</button>
    </div>
  );
}
