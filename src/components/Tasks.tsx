'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { StatusPill } from './Cards';

export function TaskRow({ task }: { task: Task }) {
  return (
    <div className="task-row">
      <div className={`task-status-dot ${task.status}`} />
      <div className="task-body">
        <div className="task-head">
          <h4>{task.title}</h4>
          <StatusPill kind={task.status}>{task.statusLabel}</StatusPill>
        </div>
        <p>{task.desc}</p>
        {task.link && (
          <a
            href={task.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="task-link"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
            {task.link.label}
          </a>
        )}
      </div>
    </div>
  );
}

interface MeasurableProgressProps {
  pct: number;
  rows: { label: string; value: string }[];
}

export function MeasurableProgress({ pct, rows }: MeasurableProgressProps) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>Measurable Progress</h3>
        <span className="pct">{pct}%</span>
      </div>
      <div className="bar">
        <i style={{ width: pct + '%' }} />
      </div>
      <div className="kv-stack">
        {rows.map((r) => (
          <div key={r.label} className="kv-row">
            <span>{r.label}</span>
            <b>{r.value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

interface CalendarEvent {
  day: number;
  title: string;
  description: string;
}

interface CalendarProps {
  month: string;
  year: number;
  picked: number;
  deadlines: number[];
  events?: CalendarEvent[];
}

function getDaysInMonth(month: string, year: number): number {
  const monthIndex = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ].indexOf(month);
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstDayOfWeek(month: string, year: number): number {
  const monthIndex = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ].indexOf(month);
  return new Date(year, monthIndex, 1).getDay();
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export function TimeBoundCalendar({ month, year, picked, deadlines, events = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDow = getFirstDayOfWeek(currentMonth, currentYear);

  const prevMonthDays = getDaysInMonth(
    MONTHS[(MONTHS.indexOf(currentMonth) - 1 + 12) % 12],
    MONTHS.indexOf(currentMonth) === 0 ? currentYear - 1 : currentYear
  );

  const allEvents: CalendarEvent[] = [
    ...events,
    { day: picked, title: 'Target Start Date', description: `${currentMonth} ${picked}, ${currentYear}` },
    ...deadlines.map((d) => ({
      day: d,
      title: 'Deadline: Step 1 Registration',
      description: `${currentMonth} ${d}, ${currentYear}`,
    })),
  ];

  const selectedEvents = selectedDay
    ? allEvents.filter((e) => e.day === selectedDay)
    : [];

  const goPrev = () => {
    const mi = MONTHS.indexOf(currentMonth);
    if (mi === 0) {
      setCurrentMonth(MONTHS[11]);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(MONTHS[mi - 1]);
    }
    setSelectedDay(null);
  };

  const goNext = () => {
    const mi = MONTHS.indexOf(currentMonth);
    if (mi === 11) {
      setCurrentMonth(MONTHS[0]);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(MONTHS[mi + 1]);
    }
    setSelectedDay(null);
  };

  const cells: { day: number; inMonth: boolean }[] = [];
  for (let i = 0; i < firstDow; i++) {
    cells.push({ day: prevMonthDays - firstDow + 1 + i, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, inMonth: false });
    }
  }

  const isOriginalMonth = currentMonth === month && currentYear === year;

  return (
    <section className="card">
      <div className="card-head">
        <h3 style={{ fontSize: 18 }}>Time-bound</h3>
        <div className="cal-nav">
          <button onClick={goPrev} aria-label="Previous month" type="button">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
          </button>
          <span>{currentMonth} {currentYear}</span>
          <button onClick={goNext} aria-label="Next month" type="button">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </button>
        </div>
      </div>
      <div className="cal-grid cal-dow">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((cell, idx) => {
          if (!cell.inMonth) {
            return (
              <div key={`dim-${idx}`} className="cal-day cal-dim">
                {cell.day}
              </div>
            );
          }
          const d = cell.day;
          const isPicked = isOriginalMonth && d === picked;
          const isDeadline = isOriginalMonth && deadlines.includes(d);
          const isSelected = d === selectedDay;
          const hasEvent = isPicked || isDeadline || allEvents.some((e) => e.day === d);
          return (
            <button
              key={d}
              type="button"
              className={`cal-day cal-interactive${isPicked ? ' cal-pick' : ''}${isDeadline ? ' cal-deadline' : ''}${isSelected ? ' cal-selected' : ''}`}
              onClick={() => setSelectedDay(selectedDay === d ? null : d)}
              title={hasEvent ? 'Click to view details' : undefined}
            >
              {d}
            </button>
          );
        })}
      </div>

      {selectedDay !== null && selectedEvents.length > 0 && (
        <div className="cal-event-popup">
          {selectedEvents.map((ev, i) => (
            <div key={i} className="cal-event-item">
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>event</span>
              <div>
                <p className="cal-legend-title">{ev.title}</p>
                <p className="cal-legend-sub">{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDay === null && isOriginalMonth && (
        <div className="cal-legend">
          <span className="cal-legend-dot" />
          <div>
            <p className="cal-legend-title">Deadline: Step 1 Registration</p>
            <p className="cal-legend-sub">October 22nd, {year}</p>
          </div>
        </div>
      )}
    </section>
  );
}
