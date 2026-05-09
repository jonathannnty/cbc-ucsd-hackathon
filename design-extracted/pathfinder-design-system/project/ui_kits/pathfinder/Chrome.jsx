// Chrome.jsx — Pathfinder app shell
// TopNavBar (wordmark + language toggle + avatar), JourneyStepper (left side
// 8-step guide), BottomTabBar (mobile only), and the recurring "Why do we need
// this?" justification block.
//
// Active step uses --secondary-container background (forest green family).
// Completed steps fill check_circle.

const STEPS = [
  { id: 'identity',    label: 'Identity',    icon: 'person' },
  { id: 'education',   label: 'Education',   icon: 'school' },
  { id: 'documents',   label: 'Documents',   icon: 'description' },
  { id: 'budget',      label: 'Budget',      icon: 'savings' },
  { id: 'pathway',     label: 'Pathway',     icon: 'route' },
  { id: 'verification',label: 'Verification',icon: 'verified' },
  { id: 'plan',        label: 'SMART Plan',  icon: 'assignment_turned_in' },
  { id: 'complete',    label: 'Complete',    icon: 'check_circle' },
];

function TopNavBar({ lang, onLangClick }) {
  return (
    <header className="topnav">
      <div className="topnav-brand">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--primary)', fontSize: 28 }}>route</span>
        <span className="wordmark">Pathfinder</span>
      </div>
      <div className="topnav-right">
        <button className="lang-toggle" onClick={onLangClick}>
          <span className="material-symbols-outlined">translate</span>
          <span>{lang}</span>
        </button>
        <div className="avatar" aria-label="User profile">AS</div>
      </div>
    </header>
  );
}

function JourneyStepper({ activeId, completedIds }) {
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
        {STEPS.map(s => {
          const done = completedIds.includes(s.id);
          const active = s.id === activeId;
          return (
            <a key={s.id} className={'step ' + (active ? 'active' : done ? 'done' : 'upcoming')}>
              <span className="material-symbols-outlined" style={done && !active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {done && !active ? 'check_circle' : s.icon}
              </span>
              <span>{s.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="stepper-support">
        <button className="btn-outline">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>help_outline</span>
          View Support
        </button>
      </div>
    </aside>
  );
}

function BottomTabBar({ active, onChange }) {
  const tabs = [
    { id: 'journey', icon: 'map',           label: 'Journey' },
    { id: 'docs',    icon: 'folder_shared', label: 'Docs' },
    { id: 'help',    icon: 'support_agent', label: 'Help' },
    { id: 'profile', icon: 'account_circle',label: 'Profile' },
  ];
  return (
    <nav className="bottomnav">
      {tabs.map(t => (
        <button key={t.id} className={'tab ' + (t.id === active ? 'tab-active' : '')} onClick={() => onChange(t.id)}>
          <span className="material-symbols-outlined" style={t.id === active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function WhyDoWeNeedThis({ children }) {
  return (
    <div className="why-block">
      <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontVariationSettings: "'FILL' 1" }}>info</span>
      <div>
        <p className="why-title">Why do we need this?</p>
        <p className="why-body">{children}</p>
      </div>
    </div>
  );
}

Object.assign(window, { TopNavBar, JourneyStepper, BottomTabBar, WhyDoWeNeedThis, STEPS });
