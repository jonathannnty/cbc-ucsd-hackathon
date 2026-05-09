// Tasks.jsx — SMART plan task list, measurable progress bar, time-bound calendar.

function TaskRow({ task, onToggle }) {
  return (
    <div className={'task-row ' + (task.done ? 'task-done' : '')}>
      <input type="checkbox" checked={task.done} onChange={onToggle} />
      <div className="task-body">
        <div className="task-head">
          <h4>{task.title}</h4>
          <StatusPill kind={task.status}>{task.statusLabel}</StatusPill>
        </div>
        <p>{task.desc}</p>
      </div>
    </div>
  );
}

function MeasurableProgress({ pct, rows }) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Measurable Progress</h3>
        <span className="pct">{pct}%</span>
      </div>
      <div className="bar"><i style={{ width: pct + '%' }} /></div>
      <div className="kv-stack">
        {rows.map(r => (
          <div key={r.label} className="kv-row">
            <span>{r.label}</span>
            <b>{r.value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimeBoundCalendar({ month, year, picked, deadlines }) {
  // Simplified — fixed Oct 2024 grid for the prototype.
  const days = Array.from({ length: 35 }, (_, i) => i - 1); // -1, 0, 1..33
  return (
    <section className="card">
      <div className="card-head">
        <h3 style={{ fontSize: 18 }}>Time-bound</h3>
        <div className="cal-nav">
          <button><span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span></button>
          <span>{month} {year}</span>
          <button><span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span></button>
        </div>
      </div>
      <div className="cal-grid cal-dow">
        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="cal-grid">
        {days.map(d => {
          if (d < 1 || d > 31) return <div key={'p'+d} className="cal-day cal-dim">{d <= 0 ? 30 + d : d - 31}</div>;
          const isPicked = d === picked;
          const isDeadline = deadlines.includes(d);
          return <div key={d} className={'cal-day ' + (isPicked ? 'cal-pick ' : '') + (isDeadline ? 'cal-deadline' : '')}>{d}</div>;
        })}
      </div>
      <div className="cal-legend">
        <span className="cal-legend-dot" />
        <div>
          <p className="cal-legend-title">Deadline: Step 1 Registration</p>
          <p className="cal-legend-sub">October 22nd, 2024</p>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TaskRow, MeasurableProgress, TimeBoundCalendar });
