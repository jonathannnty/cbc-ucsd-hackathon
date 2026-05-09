'use client';

interface Props {
  onRestart: () => void;
}

export default function CompleteScreen({ onRestart }: Props) {
  return (
    <div className="success">
      <div className="success-icon">
        <span className="material-symbols-outlined">check_circle</span>
      </div>
      <h1 className="display" style={{ color: 'var(--secondary)' }}>
        Your plan is ready.
      </h1>
      <p className="lead">
        Your SMART recertification roadmap has been generated. Print it to keep a copy, or start
        over to explore a different pathway.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-secondary" onClick={onRestart}>
          Start Over
        </button>
        <button className="btn-primary" onClick={() => window.print()}>
          <span className="material-symbols-outlined">print</span>
          Print Your Plan
        </button>
      </div>
    </div>
  );
}
