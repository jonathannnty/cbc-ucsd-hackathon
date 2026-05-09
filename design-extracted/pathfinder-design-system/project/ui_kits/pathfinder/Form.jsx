// Form.jsx — Pathfinder form primitives
// Inputs feature a 1px outline-variant wrap PLUS a 2px primary bottom border.
// This is doctrine — echoes a physical form line.

function Field({ label, htmlFor, icon, children, hint }) {
  return (
    <div className="field-group">
      <label htmlFor={htmlFor}>{label}</label>
      <div className="field">
        {icon && <span className="material-symbols-outlined field-icon">{icon}</span>}
        {children}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Select({ id, value, onChange, options, placeholder }) {
  return (
    <>
      <select id={id} value={value} onChange={e => onChange(e.target.value)}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="material-symbols-outlined field-chev">expand_more</span>
    </>
  );
}

function TextInput({ id, value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function RadioCard({ icon, title, desc, selected, onSelect }) {
  return (
    <button type="button" className={'radio-card ' + (selected ? 'selected' : '')} onClick={onSelect}>
      <div className="radio-card-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="radio-card-body">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <div className="radio-dot">{selected && <div className="radio-dot-inner" />}</div>
    </button>
  );
}

function RangeSlider({ label, value, min, max, step, format, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-group">
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ '--pct': pct + '%' }}
      />
    </div>
  );
}

Object.assign(window, { Field, Select, TextInput, RadioCard, RangeSlider });
