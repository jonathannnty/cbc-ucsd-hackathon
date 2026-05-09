// Cards.jsx — Pathway cards, evaluator cards, confidence/status pills, specialist sidebar.
// PathwayCard supports a "recommended" variant — terracotta primary-container background,
// 2px primary ring, RECOMMENDED chip in the corner. Cards never have more than two actions.

function ConfidenceBadge({ level }) {
  const cls = level.toLowerCase();
  return (
    <span className={'pill conf-' + cls}>
      <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      Confidence: {level}
    </span>
  );
}

function StatusPill({ kind, children }) {
  return <span className={'pill status-' + kind}>{children}</span>;
}

function PathwayCard({ icon, title, time, cost, desc, confidence = 'High', recommended = false, onSelect, ctaLabel }) {
  return (
    <div className={'pathway-card ' + (recommended ? 'recommended' : '')}>
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
      <button className={recommended ? 'btn-on-primary' : 'btn-tonal'} onClick={onSelect}>
        {ctaLabel || (recommended ? 'Start Enrollment' : 'Select Path')}
      </button>
    </div>
  );
}

function EvaluatorCard({ ribbon, name, subtitle, metric, metricLabel, bullets, recommended, onSelect }) {
  return (
    <div className={'evaluator-card ' + (recommended ? 'recommended' : '')}>
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
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: recommended ? '#fff' : 'var(--secondary)' }}>
              {recommended ? 'verified' : 'check_circle'}
            </span>
            {b}
          </li>
        ))}
      </ul>
      <button className={recommended ? 'btn-on-primary' : 'btn-primary'} onClick={onSelect}>Start Application</button>
    </div>
  );
}

function SpecialistCard() {
  return (
    <div className="specialist-card">
      <h4>Need Clarification?</h4>
      <p>Your case manager, Marcus, is available for a 15-minute check-in call.</p>
      <div className="specialist-row">
        <div className="avatar avatar-lg">MT</div>
        <div>
          <p className="specialist-name">Marcus Thorne</p>
          <p className="specialist-role">Licensing Specialist</p>
        </div>
      </div>
      <button className="btn-primary">Schedule Call</button>
    </div>
  );
}

function HumanOversightDisclaimer() {
  return (
    <div className="oversight">
      <div className="oversight-icon">
        <span className="material-symbols-outlined">psychology</span>
      </div>
      <div className="oversight-body">
        <h4>Human Oversight Disclaimer</h4>
        <p>Pathfinder provides these comparisons based on current data. Each credentialing case is unique. We strongly recommend a final review with a Pathfinder advisor before committing.</p>
      </div>
      <button className="btn-outline btn-outline-strong">Talk to Advisor</button>
    </div>
  );
}

Object.assign(window, { ConfidenceBadge, StatusPill, PathwayCard, EvaluatorCard, SpecialistCard, HumanOversightDisclaimer });
