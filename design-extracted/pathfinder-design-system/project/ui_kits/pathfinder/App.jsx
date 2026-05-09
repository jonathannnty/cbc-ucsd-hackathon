// App.jsx — top-level state + screen routing for the Pathfinder click-thru.
// Keeps everything in a single React component to make the prototype easy to
// follow. Real flow has 8 steps; we collapse to the same 8 screen IDs:
//   welcome → identity → documents → budget → pathway → verification → plan → complete

const { useState } = React;

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية (Arabic)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'fa', label: 'دری (Dari)' },
  { code: 'ps', label: 'پښتو (Pashto)' },
];

const PROFESSIONS = [
  { value: 'doctor',   label: 'Doctor / Physician' },
  { value: 'nurse',    label: 'Registered Nurse' },
  { value: 'engineer', label: 'Civil/Mechanical Engineer' },
  { value: 'teacher',  label: 'Primary/Secondary Teacher' },
  { value: 'architect',label: 'Architect' },
  { value: 'other',    label: 'Other Professional' },
];

const STATES = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'IL', label: 'Illinois' },
];

const DOC_OPTIONS = [
  { id: 'all',     icon: 'folder_zip',      title: 'I have all my documents',          desc: 'Diplomas, transcripts, and licenses are with me.' },
  { id: 'partial', icon: 'description',     title: 'I have some documents',            desc: 'I have a few — others are missing or back home.' },
  { id: 'none',    icon: 'help_outline',    title: 'I have nothing on paper',          desc: 'I had to leave without any official records.' },
  { id: 'destroyed', icon: 'event_busy',    title: 'My institution no longer exists',  desc: 'My university or licensing body has closed.' },
];

const PATHWAYS = [
  { icon: 'medical_services', title: 'Medical Scribe',        time: '3-6 Months', cost: '$300 - $800',   confidence: 'High',   desc: 'Gain US clinical environment exposure and work alongside clinicians.' },
  { icon: 'science',          title: 'Clinical Research Asst.', time: '6-9 Months', cost: '$500 - $1.2k', confidence: 'High',   desc: 'Apply analytical skills to manage data and patient protocols.' },
  { icon: 'medication',       title: 'Pharmacy Technician',   time: '4-12 Months',cost: '$200 - $1.5k',  confidence: 'Medium', desc: 'Apply your pharmacology knowledge in retail or hospital settings.' },
  { icon: 'group_add',        title: 'PA (Bridge Track)',     time: '24 Months',  cost: '$2,000+',       confidence: 'High',   desc: 'A specialized track for IMGs that leverages prior medical training.', recommended: true },
];

const EVALUATORS = [
  { name: 'Josef Silny', subtitle: 'NACES Member', metric: '$90 USD', metricLabel: 'Starting from', ribbon: { icon: 'payments', label: 'Cheapest' }, bullets: ['Best value for general evaluations', '10-15 business day turnaround', 'Translation services available'] },
  { name: 'WES',         subtitle: 'World Education Services', metric: '7 Days', metricLabel: 'Turnaround', ribbon: { icon: 'speed', label: 'Fastest' }, recommended: true, bullets: ['Digital badge integration included', 'Recognized by 2,500+ institutions', 'Robust online document portal'] },
  { name: 'ECFMG',       subtitle: 'Medical Professionals', metric: 'Clinical', metricLabel: 'Focus', ribbon: { icon: 'medical_services', label: 'Best for Medical' }, bullets: ['Required for USMLE pathways', 'Specialized residency reporting', 'Verification at source (EPIC)'] },
];

const TASKS_INITIAL = [
  { id: 1, title: 'Submit WES Evaluation',         desc: 'Request official transcripts from University of Medicine, Kiev.', status: 'priority',  statusLabel: 'High Priority', done: false },
  { id: 2, title: 'Register for Step 1',           desc: 'USMLE application successfully submitted.',                         status: 'completed', statusLabel: 'Completed',     done: true  },
  { id: 3, title: 'Background Check Authorization',desc: 'Provide digital signature for state-level clearance.',              status: 'upcoming',  statusLabel: 'Upcoming',      done: false },
  { id: 4, title: 'Schedule TOEFL Exam',           desc: 'Book your earliest available test center.',                         status: 'upcoming',  statusLabel: 'Upcoming',      done: false },
];

const SCREENS = ['welcome','identity','documents','budget','pathway','verification','plan','complete'];

function App() {
  const [screen, setScreen] = useState('welcome');
  const [lang, setLang] = useState('en');
  const [profession, setProfession] = useState('doctor');
  const [country, setCountry] = useState('Syria');
  const [state, setState] = useState('NY');
  const [docSituation, setDocSituation] = useState('partial');
  const [budget, setBudget] = useState(2000);
  const [months, setMonths] = useState(24);
  const [pickedPathway, setPickedPathway] = useState(3);
  const [pickedEvaluator, setPickedEvaluator] = useState(1);
  const [tasks, setTasks] = useState(TASKS_INITIAL);
  const [tab, setTab] = useState('journey');

  const screenIdx = SCREENS.indexOf(screen);
  const completedIds = STEPS.slice(0, Math.max(0, screenIdx - 1)).map(s => s.id);
  const stepperActive = ({
    welcome: 'identity', identity: 'identity', documents: 'documents', budget: 'budget',
    pathway: 'pathway', verification: 'verification', plan: 'plan', complete: 'complete'
  })[screen];

  const next = () => { const i = SCREENS.indexOf(screen); if (i < SCREENS.length - 1) setScreen(SCREENS[i + 1]); };
  const back = () => { const i = SCREENS.indexOf(screen); if (i > 0) setScreen(SCREENS[i - 1]); };
  const langLabel = LANGUAGES.find(l => l.code === lang)?.label || 'English';

  return (
    <div className="app">
      <img src="../../assets/blob.svg" className="deco-blob" aria-hidden="true" />
      <TopNavBar lang={langLabel} onLangClick={() => {
        const i = LANGUAGES.findIndex(l => l.code === lang);
        setLang(LANGUAGES[(i + 1) % LANGUAGES.length].code);
      }} />
      <div className="shell">
        {screen !== 'welcome' && <JourneyStepper activeId={stepperActive} completedIds={completedIds} />}
        <main className="canvas">
          {screen === 'welcome'   && <WelcomeScreen lang={lang} setLang={setLang} onContinue={next} />}
          {screen === 'identity'  && <IdentityScreen profession={profession} setProfession={setProfession} country={country} setCountry={setCountry} state={state} setState={setState} onBack={back} onContinue={next} />}
          {screen === 'documents' && <DocumentsScreen docSituation={docSituation} setDocSituation={setDocSituation} onBack={back} onContinue={next} />}
          {screen === 'budget'    && <BudgetScreen budget={budget} setBudget={setBudget} months={months} setMonths={setMonths} onBack={back} onContinue={next} />}
          {screen === 'pathway'   && <PathwayScreen pickedPathway={pickedPathway} setPickedPathway={setPickedPathway} profession={profession} budget={budget} months={months} onBack={back} onContinue={next} />}
          {screen === 'verification' && <VerificationScreen pickedEvaluator={pickedEvaluator} setPickedEvaluator={setPickedEvaluator} onBack={back} onContinue={next} />}
          {screen === 'plan'      && <PlanScreen tasks={tasks} setTasks={setTasks} onBack={back} onContinue={next} />}
          {screen === 'complete'  && <CompleteScreen onRestart={() => setScreen('welcome')} />}
        </main>
      </div>
      <BottomTabBar active={tab} onChange={setTab} />
    </div>
  );
}

function WelcomeScreen({ lang, setLang, onContinue }) {
  return (
    <div className="canvas-wide section-stack">
      <div className="welcome-grid">
        <div className="welcome-hero">
          <span className="pill status-completed" style={{ alignSelf: 'flex-start' }}>New Arrivals Support</span>
          <h1 className="display">Your skills travel with you. Let's find your path in the US.</h1>
          <p className="lead">Navigate the complex process of foreign credential recognition and professional licensing with a steadfast partner. We help you unlock your professional future.</p>
          <div><button className="btn-primary" onClick={onContinue}>Get Started</button></div>
        </div>
        <div className="welcome-side">
          <div className="image-card">
            <p className="image-card-caption">Diverse professionals collaborating in a sun-drenched workspace.</p>
          </div>
          <div className="lang-card">
            <h2>Select Your Language</h2>
            <p>Choose the language you feel most comfortable using.</p>
            <div className="lang-grid">
              {LANGUAGES.map(l => (
                <button key={l.code} className={'lang-btn ' + (lang === l.code ? 'active' : '')} onClick={() => setLang(l.code)}>{l.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FeatureSummary />
    </div>
  );
}

function FeatureSummary() {
  const items = [
    { icon: 'verified_user', title: 'Credential Verification', desc: 'Securely map your educational history to US standards.' },
    { icon: 'route',         title: 'Career Pathways',         desc: 'Clear, step-by-step roadmaps for your profession.' },
    { icon: 'support_agent', title: 'Human Support',           desc: 'Expert guidance to overcome bureaucratic hurdles.' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
      {items.map(i => (
        <div key={i.title} className="card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 36 }}>{i.icon}</span>
          <div>
            <h3 style={{ margin: '0 0 4px', font: '600 16px/1.3 var(--font-body)' }}>{i.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--on-surface-variant)' }}>{i.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function IdentityScreen({ profession, setProfession, country, setCountry, state, setState, onBack, onContinue }) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <h1 className="display">Tell Us About You</h1>
          <p className="lead">We use this information to customize your professional credentialing pathway. All data is handled securely.</p>
        </div>
        <div className="card" style={{ padding: 32, gap: 24 }}>
          <Field label="What was your profession in your home country?" htmlFor="prof" icon="work">
            <Select id="prof" value={profession} onChange={setProfession} options={PROFESSIONS} placeholder="Search or select a profession" />
          </Field>
          <Field label="Which country did you earn your degree in?" htmlFor="country" icon="public">
            <TextInput id="country" value={country} onChange={setCountry} placeholder="Enter country name" />
          </Field>
          <Field label="Which US state do you live in now?" htmlFor="state" icon="location_on">
            <Select id="state" value={state} onChange={setState} options={STATES} placeholder="Select a state" />
          </Field>
          <div className="row-actions">
            <button className="btn-secondary" onClick={onBack}>Back</button>
            <button className="btn-primary" onClick={onContinue}>Continue to Documents</button>
          </div>
        </div>
      </div>
      <WhyDoWeNeedThis>Credentialing requirements vary significantly by state and professional background. Providing accurate details ensures your pathway includes the specific boards and agencies you'll need to contact.</WhyDoWeNeedThis>
    </div>
  );
}

function DocumentsScreen({ docSituation, setDocSituation, onBack, onContinue }) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack">
        <div>
          <span className="eyebrow">Step 3 of 8</span>
          <h1 className="display">Your Documents Situation</h1>
          <p className="lead">Many people arrive without their original credentials. Tell us where you stand — there's a path either way.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DOC_OPTIONS.map(o => (
            <RadioCard key={o.id} icon={o.icon} title={o.title} desc={o.desc} selected={docSituation === o.id} onSelect={() => setDocSituation(o.id)} />
          ))}
        </div>
        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Continue to Budget</button>
        </div>
      </div>
      <WhyDoWeNeedThis>If your documents are unavailable, we'll route you toward bridging programs and refugee-credentialing attorneys who can help reconstruct your record.</WhyDoWeNeedThis>
    </div>
  );
}

function BudgetScreen({ budget, setBudget, months, setMonths, onBack, onContinue }) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack">
        <div>
          <span className="eyebrow">Step 4 of 8</span>
          <h1 className="display">Your Time & Money Budget</h1>
          <p className="lead">We'll show pathways that fit your real constraints — not the theoretical fastest route.</p>
        </div>
        <div className="card" style={{ padding: 32, gap: 32 }}>
          <RangeSlider label="Money you can invest" value={budget} min={0} max={20000} step={500} onChange={setBudget} format={v => '$' + v.toLocaleString()} />
          <RangeSlider label="Time you can commit"  value={months} min={3} max={60} step={1}    onChange={setMonths} format={v => v + ' Months'} />
        </div>
        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Find My Pathways</button>
        </div>
      </div>
      <WhyDoWeNeedThis>We present cost and time as ranges, with the assumptions stated. If your budget makes the standard route unrealistic, we'll show you adjacent bridge roles.</WhyDoWeNeedThis>
    </div>
  );
}

function PathwayScreen({ pickedPathway, setPickedPathway, profession, budget, months, onBack, onContinue }) {
  const profLabel = PROFESSIONS.find(p => p.value === profession)?.label || 'Professional';
  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <div className="tag-row">
            <span className="pill tag-primary">{profLabel}</span>
            <span className="pill">Budget: ${budget.toLocaleString()}</span>
            <span className="pill">Time: {months} Months</span>
          </div>
          <h1 className="display">Matching Your Situation</h1>
          <p className="lead">Based on your profile, we have identified bridge roles and career steps that honor your expertise while fitting within your constraints.</p>
        </div>
        <div className="pathway-grid">
          {PATHWAYS.map((p, i) => (
            <PathwayCard key={p.title} {...p} recommended={p.recommended && i === pickedPathway} onSelect={() => setPickedPathway(i)} ctaLabel={i === pickedPathway ? 'Selected ✓' : (p.recommended ? 'Start Enrollment' : 'Select Path')} />
          ))}
        </div>
        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Continue to Verification</button>
        </div>
      </div>
    </div>
  );
}

function VerificationScreen({ pickedEvaluator, setPickedEvaluator, onBack, onContinue }) {
  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 6 of 8 · NACES</span>
          <h1 className="display">NACES Evaluator Picker</h1>
          <p className="lead">Compare approved NACES member organizations to find the best fit for your specific professional and academic requirements.</p>
        </div>
        <div className="evaluator-grid" style={{ marginTop: 16 }}>
          {EVALUATORS.map((e, i) => (
            <EvaluatorCard key={e.name} {...e} recommended={i === pickedEvaluator} onSelect={() => setPickedEvaluator(i)} />
          ))}
        </div>
        <HumanOversightDisclaimer />
        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Build My SMART Plan</button>
        </div>
      </div>
    </div>
  );
}

function PlanScreen({ tasks, setTasks, onBack, onContinue }) {
  const toggle = id => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'completed' : 'priority', statusLabel: !t.done ? 'Completed' : 'High Priority' } : t));
  const donePct = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow">Strategy Phase</span>
            <h1 className="display">SMART Recertification Plan</h1>
            <p className="lead">Your structured roadmap for the next 90 days. We've broken down your medical license recertification into actionable, measurable steps.</p>
          </div>
          <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined">support_agent</span>
            Talk to a Specialist
          </button>
        </div>
        <div className="plan-grid">
          <div className="section-stack">
            <section className="card">
              <div className="card-head" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="material-symbols-outlined" style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)', padding: 6, borderRadius: 8 }}>checklist</span>
                  <h3>Specific Tasks</h3>
                </div>
              </div>
              <div className="task-list">
                {tasks.map(t => <TaskRow key={t.id} task={t} onToggle={() => toggle(t.id)} />)}
              </div>
            </section>
          </div>
          <div className="section-stack">
            <MeasurableProgress pct={donePct} rows={[
              { label: 'Documents Verified', value: '5 / 8' },
              { label: 'Exam Prep Modules', value: '12 / 15' },
              { label: 'State Approvals',   value: '1 / 4'  },
            ]} />
            <TimeBoundCalendar month="October" year="2024" picked={15} deadlines={[22]} />
            <SpecialistCard />
          </div>
        </div>
        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Save & Continue</button>
        </div>
      </div>
    </div>
  );
}

function CompleteScreen({ onRestart }) {
  return (
    <div className="success">
      <div className="success-icon">
        <span className="material-symbols-outlined">check_circle</span>
      </div>
      <h1 className="display" style={{ color: 'var(--secondary)' }}>Your plan is saved.</h1>
      <p className="lead">We'll send a copy to your email and check in every two weeks. You can return any time to adjust your timeline.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" onClick={onRestart}>Start Over</button>
        <button className="btn-primary">Open Dashboard</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
