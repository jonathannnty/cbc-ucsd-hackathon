'use client';

interface Props {
  onContinue: () => void;
}

export default function WelcomeScreen({ onContinue }: Props) {
  return (
    <div className="canvas-wide section-stack">
      <div className="welcome-grid">
        <div className="welcome-hero">
          <span className="pill status-completed" style={{ alignSelf: 'flex-start' }}>
            New Arrivals Support
          </span>
          <h1 className="display">
            Your skills travel with you. Let&rsquo;s find your path in the US.
          </h1>
          <p className="lead">
            Navigate the complex process of foreign credential recognition and professional
            licensing with a steadfast partner. We help you unlock your professional future.
          </p>
          <div>
            <button className="btn-primary" onClick={onContinue}>
              Get Started
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="image-card">
            <p className="image-card-caption">
              Diverse professionals collaborating in a sun-drenched workspace.
            </p>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        {[
          {
            icon: 'verified_user',
            title: 'Credential Verification',
            desc: 'Securely map your educational history to US standards.',
          },
          {
            icon: 'route',
            title: 'Career Pathways',
            desc: 'Clear, step-by-step roadmaps for your profession.',
          },
          {
            icon: 'support_agent',
            title: 'Human Support',
            desc: 'Expert guidance to overcome bureaucratic hurdles.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="card"
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--primary)', fontSize: 36, flexShrink: 0 }}
            >
              {item.icon}
            </span>
            <div>
              <h3 style={{ margin: '0 0 4px', font: '600 16px/1.3 var(--font-body)' }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--on-surface-variant)' }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
