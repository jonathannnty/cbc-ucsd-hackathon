'use client';

import React from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  icon?: string;
  children: React.ReactNode;
  hint?: string;
  noIcon?: boolean;
}

export function Field({ label, htmlFor, icon, children, hint, noIcon }: FieldProps) {
  return (
    <div className="field-group">
      <label htmlFor={htmlFor}>{label}</label>
      <div className={`field${noIcon ? ' no-icon' : ''}`}>
        {icon && !noIcon && (
          <span className="material-symbols-outlined field-icon">{icon}</span>
        )}
        {children}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

interface SelectInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectInput({ id, value, onChange, options, placeholder }: SelectInputProps) {
  return (
    <>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined field-chev">expand_more</span>
    </>
  );
}

interface TextInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextInput({ id, value, onChange, placeholder, type = 'text' }: TextInputProps) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

interface RadioCardProps {
  icon: string;
  title: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
}

export function RadioCard({ icon, title, desc, selected, onSelect }: RadioCardProps) {
  return (
    <button
      type="button"
      className={`radio-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <div className="radio-card-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="radio-card-body">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <div className="radio-dot">
        {selected && <div className="radio-dot-inner" />}
      </div>
    </button>
  );
}

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function RangeSlider({ label, value, min, max, step, format, onChange }: RangeSliderProps) {
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
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': pct + '%' } as React.CSSProperties}
      />
    </div>
  );
}
