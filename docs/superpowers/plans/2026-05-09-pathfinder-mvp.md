# Pathfinder MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Pathfinder credential-translation web app as a 9-step multi-screen flow in Next.js, matching the provided design system pixel-faithfully, with MVP scope (no multi-language, no dashboard, PDF-only plan output).

**Architecture:** Single Next.js 14 App Router page (`app/page.tsx`) holds all state and renders each screen based on a `screen` string; screens are pure presentational components that receive props and callbacks. Design tokens live in `app/globals.css` (merged from the design system's `colors_and_type.css` + `kit.css`). Shared UI primitives are split into `Chrome.tsx`, `Form.tsx`, `Cards.tsx`, and `Tasks.tsx`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, CSS custom properties (no Tailwind), Material Symbols Outlined + Atkinson Hyperlegible Next via Google Fonts CDN.

---

## File Map

| File | Responsibility |
|---|---|
| `package.json` | Next.js 14 + React 18 + TypeScript dependencies |
| `next.config.js` | Minimal Next.js config |
| `tsconfig.json` | TypeScript config with `@/` path alias |
| `public/blob.svg` | Decorative SVG blob from design system |
| `src/app/layout.tsx` | Root layout — Google Fonts link tags, `<html>` + `<body>` |
| `src/app/globals.css` | All design tokens + component CSS (merged from design system) |
| `src/app/page.tsx` | App state + screen routing |
| `src/types.ts` | All shared TypeScript types |
| `src/components/Chrome.tsx` | TopNavBar (no lang toggle), JourneyStepper, WhyDoWeNeedThis |
| `src/components/Form.tsx` | Field, Select, TextInput, RadioCard, RangeSlider |
| `src/components/Cards.tsx` | PathwayCard, EvaluatorCard, ConfidenceBadge, StatusPill, SpecialistCard, HumanOversightDisclaimer |
| `src/components/Tasks.tsx` | TaskRow (read-only display), MeasurableProgress, TimeBoundCalendar |
| `src/screens/WelcomeScreen.tsx` | Hero + CTA (no language picker) |
| `src/screens/IdentityScreen.tsx` | Profession / country / state; "Other Professional" text input |
| `src/screens/EducationScreen.tsx` | Degree level, credential type, field of study, institution, graduation year |
| `src/screens/DocumentsScreen.tsx` | Document situation radio cards |
| `src/screens/BudgetScreen.tsx` | Budget + months sliders |
| `src/screens/PathwayScreen.tsx` | Bridge-role cards; recommended card rendered first |
| `src/screens/VerificationScreen.tsx` | NACES evaluator cards + "Skip" link |
| `src/screens/PlanScreen.tsx` | Read-only SMART plan; "Print PDF" button only |
| `src/screens/CompleteScreen.tsx` | Success state; "Print Your Plan" + "Start Over" only |

---

## Task 1: Bootstrap Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`

- [ ] **Step 1: Initialise the project files manually (avoids interactive prompts)**

Create `package.json`:
```json
{
  "name": "pathfinder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.29",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}
```

Create `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd C:\Users\jonat\OneDrive\Desktop\Projects\cbc-ucsd-hackathon
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json next.config.js tsconfig.json
git commit -m "chore: initialise Next.js 14 + TypeScript project"
```

---

## Task 2: Design Tokens CSS

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `public/blob.svg`

- [ ] **Step 1: Create `public/blob.svg`** (decorative background ornament)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path fill="#9c3f12" d="M47.7,-57.2C59.5,-45.5,65.1,-28.2,67.2,-10.4C69.3,7.4,67.9,25.8,59.1,39.6C50.3,53.4,34.1,62.6,16.5,67.5C-1.1,72.4,-20.1,73,-36.2,65.2C-52.3,57.4,-65.5,41.2,-70.2,23.1C-74.9,5,-71.1,-14.9,-61.3,-30.3C-51.5,-45.7,-35.7,-56.6,-19.5,-62.6C-3.3,-68.6,13.3,-69.7,29.2,-68.2C45.1,-66.7,60.4,-62.6,47.7,-57.2Z" transform="translate(100 100)"/>
</svg>
```

- [ ] **Step 2: Create `src/app/globals.css`**

```css
/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

/* ── Design Tokens ── */
:root {
  --surface:                    #fff8f1;
  --surface-bright:             #fff8f1;
  --surface-dim:                #e3d9c5;
  --surface-container-lowest:   #ffffff;
  --surface-container-low:      #fef2de;
  --surface-container:          #f8edd9;
  --surface-container-high:     #f2e7d3;
  --surface-container-highest:  #ece1ce;
  --surface-variant:            #ece1ce;
  --background:                 #fff8f1;
  --on-surface:                 #201b0f;
  --on-surface-variant:         #56423b;
  --on-background:              #201b0f;
  --inverse-surface:            #353023;
  --inverse-on-surface:         #fbf0db;
  --primary:                    #9c3f12;
  --on-primary:                 #ffffff;
  --primary-container:          #bc5629;
  --on-primary-container:       #fffbff;
  --primary-fixed:              #ffdbce;
  --primary-fixed-dim:          #ffb598;
  --on-primary-fixed:           #370e00;
  --on-primary-fixed-variant:   #7f2b00;
  --inverse-primary:            #ffb598;
  --secondary:                  #39693b;
  --on-secondary:               #ffffff;
  --secondary-container:        #b8edb3;
  --on-secondary-container:     #3e6d3e;
  --secondary-fixed:            #baf0b6;
  --on-secondary-fixed:         #002105;
  --on-secondary-fixed-variant: #215025;
  --tertiary:                   #6f5832;
  --on-tertiary:                #ffffff;
  --tertiary-container:         #8a7149;
  --on-tertiary-container:      #fffbff;
  --tertiary-fixed:             #fedead;
  --on-tertiary-fixed:          #281900;
  --on-tertiary-fixed-variant:  #58431f;
  --error:                      #ba1a1a;
  --on-error:                   #ffffff;
  --error-container:            #ffdad6;
  --on-error-container:         #93000a;
  --outline:                    #8a7269;
  --outline-variant:            #ddc0b6;
  --confidence-high-bg:         var(--secondary-fixed);
  --confidence-high-fg:         var(--on-secondary-fixed-variant);
  --confidence-med-bg:          var(--tertiary-fixed);
  --confidence-med-fg:          var(--on-tertiary-fixed-variant);
  --confidence-low-bg:          var(--primary-fixed);
  --confidence-low-fg:          var(--on-primary-fixed-variant);
  --font-display: 'Atkinson Hyperlegible Next', system-ui, sans-serif;
  --font-body:    'Atkinson Hyperlegible Next', system-ui, sans-serif;
  --radius-sm:   0.25rem;
  --radius:      0.5rem;
  --radius-md:   0.75rem;
  --radius-lg:   1rem;
  --radius-xl:   1.5rem;
  --radius-full: 9999px;
  --unit:           8px;
  --stack-sm:       8px;
  --stack-md:       24px;
  --stack-lg:       48px;
  --gutter:         24px;
  --margin-mobile:  16px;
  --margin-desktop: 48px;
  --container-max:  1120px;
  --shadow-sm: 0 1px 2px 0 rgba(156,63,18,.06);
  --shadow-md: 0 4px 12px -2px rgba(156,63,18,.10), 0 2px 4px -2px rgba(156,63,18,.06);
  --shadow-lg: 0 12px 32px -8px rgba(156,63,18,.15), 0 4px 8px -4px rgba(156,63,18,.08);
}

/* ── Reset ── */
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--background); color: var(--on-surface); font-family: var(--font-body); font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }

/* ── Material Symbols ── */
.material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }

/* ── App Shell ── */
.app { min-height: 100vh; display: flex; flex-direction: column; }

/* ── Top Nav ── */
.topnav { background: var(--surface); border-bottom: 1px solid var(--outline-variant); height: 80px; display: flex; align-items: center; justify-content: space-between; padding: 0 var(--margin-desktop); position: sticky; top: 0; z-index: 50; }
.topnav-brand { display: flex; align-items: center; gap: 10px; }
.wordmark { font: 700 32px/1 var(--font-display); letter-spacing: -0.02em; color: var(--primary); }
.topnav-right { display: flex; align-items: center; gap: 24px; }
.avatar { width: 40px; height: 40px; border-radius: 9999px; background: var(--primary-fixed); color: var(--on-primary-fixed); display: flex; align-items: center; justify-content: center; font: 700 14px/1 var(--font-body); border: 1px solid var(--outline-variant); }

/* ── Layout ── */
.shell { flex: 1; display: flex; min-height: 0; }
.canvas { flex: 1; overflow-y: auto; padding: 48px; }
.canvas-narrow { max-width: 720px; margin: 0 auto; }
.canvas-wide { max-width: var(--container-max); margin: 0 auto; }

/* ── Stepper ── */
.stepper { width: 288px; flex-shrink: 0; background: var(--surface-container-low); padding: 24px; display: flex; flex-direction: column; gap: 8px; border-right: 1px solid var(--outline-variant); overflow-y: auto; }
.stepper-head { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.stepper-mark { width: 40px; height: 40px; border-radius: 9999px; background: var(--primary); color: var(--on-primary); display: flex; align-items: center; justify-content: center; }
.stepper-head h2 { margin: 0; font: 600 22px/1.3 var(--font-display); color: var(--primary); }
.stepper-head p { margin: 0; font: 600 13px/1.4 var(--font-body); color: var(--on-surface-variant); }
.stepper nav { display: flex; flex-direction: column; gap: 4px; }
.step { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; color: var(--on-surface-variant); font: 600 14px/1.4 var(--font-body); text-decoration: none; cursor: default; transition: all .15s; }
.step .material-symbols-outlined { font-size: 22px; }
.step.active { background: var(--secondary-container); color: var(--on-secondary-container); font-weight: 700; }
.step.done { color: var(--secondary); }
.step.upcoming { opacity: .6; }
.stepper-support { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--outline-variant); }

/* ── Buttons ── */
.btn-primary { background: var(--primary); color: var(--on-primary); padding: 14px 28px; border: none; border-radius: 12px; font: 700 14px/1.4 var(--font-body); letter-spacing: .01em; box-shadow: var(--shadow-md); transition: all .15s; }
.btn-primary:hover { background: var(--primary-container); }
.btn-primary:active { transform: scale(.95); }
.btn-tonal { background: var(--surface-container-high); color: var(--primary); padding: 10px 20px; border: none; border-radius: 8px; font: 700 14px/1.4 var(--font-body); transition: background .15s; width: 100%; margin-top: 8px; }
.btn-tonal:hover { background: var(--surface-variant); }
.btn-on-primary { background: var(--on-primary-container); color: var(--primary-container); padding: 12px 20px; border: none; border-radius: 8px; font: 800 14px/1.4 var(--font-body); width: 100%; margin-top: 8px; transition: background .15s; }
.btn-on-primary:hover { background: #fff; }
.btn-outline { background: transparent; color: var(--primary); border: 1px solid var(--primary); border-radius: 12px; padding: 12px 20px; font: 700 14px/1.4 var(--font-body); display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all .15s; }
.btn-outline:hover { background: var(--primary-container); color: var(--on-primary-container); }
.btn-outline-strong { border-width: 2px; width: auto; white-space: nowrap; }
.btn-secondary { background: transparent; color: var(--on-surface-variant); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 14px 28px; font: 700 14px/1.4 var(--font-body); }
.btn-secondary:hover { background: var(--surface-container); }
.btn-text-link { background: none; border: none; color: var(--on-surface-variant); font: 600 14px/1.4 var(--font-body); padding: 8px 0; text-decoration: underline; text-underline-offset: 3px; transition: color .15s; }
.btn-text-link:hover { color: var(--on-surface); }

/* ── Typography helpers ── */
.eyebrow { font: 700 12px/1.4 var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--secondary); }
h1.display { margin: 8px 0 12px; font: 700 40px/1.2 var(--font-display); letter-spacing: -0.02em; color: var(--primary); }
.lead { font: 400 18px/1.6 var(--font-body); color: var(--on-surface-variant); max-width: 640px; }
.section-stack { display: flex; flex-direction: column; gap: 24px; }
.row-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }

/* ── Card base ── */
.card { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.card-head { display: flex; align-items: center; justify-content: space-between; }
.card-head h3 { margin: 0; font: 600 22px/1.3 var(--font-display); }
.pct { font: 700 18px/1 var(--font-body); color: var(--primary); }

/* ── Fields ── */
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font: 600 14px/1.4 var(--font-body); color: var(--primary); letter-spacing: .01em; }
.field { position: relative; display: flex; align-items: center; }
.field-icon { position: absolute; left: 14px; color: var(--on-surface-variant); font-size: 22px; pointer-events: none; }
.field-chev { position: absolute; right: 14px; color: var(--on-surface-variant); font-size: 22px; pointer-events: none; }
.field input, .field select, .field textarea { width: 100%; padding: 14px 14px 14px 44px; background: var(--surface); border: 1px solid var(--outline-variant); border-bottom: 2px solid var(--primary); border-radius: 8px; font: 400 16px/1.6 var(--font-body); color: var(--on-surface); appearance: none; -webkit-appearance: none; outline: none; transition: border-color .15s; }
.field select { padding-right: 44px; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(156,63,18,.12); }
.field-hint { margin: 0; font: 400 13px/1.5 var(--font-body); color: var(--on-surface-variant); }
.field-no-icon input, .field-no-icon select { padding-left: 14px; }

/* ── Radio Cards ── */
.radio-card { display: flex; align-items: flex-start; gap: 14px; background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 18px; text-align: left; width: 100%; transition: all .15s; }
.radio-card:hover { border-color: var(--primary); background: var(--surface-container-low); }
.radio-card.selected { border: 2px solid var(--primary); background: var(--primary-fixed); }
.radio-card-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 8px; background: var(--surface-container); display: flex; align-items: center; justify-content: center; color: var(--primary); }
.radio-card-body { flex: 1; }
.radio-card-body h4 { margin: 0 0 4px; font: 600 16px/1.3 var(--font-body); }
.radio-card-body p { margin: 0; font: 400 14px/1.5 var(--font-body); color: var(--on-surface-variant); }
.radio-dot { width: 20px; height: 20px; border: 2px solid var(--outline); border-radius: 9999px; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; }
.radio-card.selected .radio-dot { border-color: var(--primary); }
.radio-dot-inner { width: 10px; height: 10px; background: var(--primary); border-radius: 9999px; }

/* ── Sliders ── */
.slider-group { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.slider-head { display: flex; justify-content: space-between; align-items: baseline; }
.slider-label { font: 600 14px/1.4 var(--font-body); color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .06em; }
.slider-value { font: 700 24px/1 var(--font-display); color: var(--primary); }
.slider-group input[type=range] { appearance: none; -webkit-appearance: none; width: 100%; height: 6px; background: linear-gradient(to right, var(--primary) 0, var(--primary) var(--pct, 50%), var(--surface-container-highest) var(--pct, 50%), var(--surface-container-highest) 100%); border-radius: 9999px; outline: none; }
.slider-group input[type=range]::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 22px; height: 22px; background: var(--primary); border: 3px solid #fff; box-shadow: var(--shadow-md); border-radius: 9999px; cursor: pointer; }
.slider-group input[type=range]::-moz-range-thumb { width: 22px; height: 22px; background: var(--primary); border: 3px solid #fff; box-shadow: var(--shadow-md); border-radius: 9999px; cursor: pointer; }

/* ── Why Do We Need This ── */
.why-block { margin-top: 48px; padding: 24px; background: rgba(184,237,179,.3); border: 1px solid rgba(57,105,59,.2); border-radius: 16px; display: flex; gap: 24px; align-items: flex-start; }
.why-title { margin: 0 0 4px; font: 600 14px/1.4 var(--font-body); color: var(--secondary); }
.why-body { margin: 0; font: 400 16px/1.6 var(--font-body); color: var(--on-surface-variant); }

/* ── Pills ── */
.pill { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; font: 700 12px/1.2 var(--font-body); letter-spacing: .02em; }
.conf-high   { background: var(--secondary-fixed); color: var(--on-secondary-fixed-variant); }
.conf-medium { background: var(--tertiary-fixed);  color: var(--on-tertiary-fixed-variant); }
.conf-low    { background: var(--primary-fixed);   color: var(--on-primary-fixed-variant); }
.status-completed { background: var(--secondary-container); color: var(--on-secondary-container); }
.status-priority  { background: var(--error-container);     color: var(--on-error-container); }
.status-upcoming  { background: var(--surface-variant);     color: var(--on-surface-variant); }

/* ── Pathway Card ── */
.pathway-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 48px; }
.pathway-card { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 12px; transition: box-shadow .15s; position: relative; }
.pathway-card:hover { box-shadow: var(--shadow-md); }
.pathway-card.recommended { background: var(--primary-container); color: var(--on-primary-container); box-shadow: var(--shadow-lg); border: 2px solid var(--primary); }
.pathway-top { display: flex; justify-content: space-between; align-items: flex-start; }
.pathway-icon { padding: 8px; background: var(--surface-container); color: var(--primary); border-radius: 8px; font-size: 24px; }
.pathway-card.recommended .pathway-icon { background: rgba(255,255,255,.15); color: #fff; }
.pathway-card h3 { margin: 0; font: 600 22px/1.3 var(--font-display); }
.pathway-card.recommended h3 { color: var(--on-primary); }
.pathway-stats { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.pathway-stats .kv { display: flex; justify-content: space-between; border-bottom: 1px solid var(--outline-variant); padding-bottom: 4px; font: 600 13px/1.4 var(--font-body); }
.pathway-card.recommended .kv { border-color: rgba(255,255,255,.2); }
.pathway-stats .kv span { color: var(--on-surface-variant); }
.pathway-card.recommended .kv span { color: rgba(255,255,255,.85); }
.pathway-desc { margin: 0; flex: 1; font: 400 14px/1.55 var(--font-body); color: var(--on-surface-variant); }
.pathway-card.recommended .pathway-desc { color: rgba(255,255,255,.92); }
.recommended-chip { position: absolute; top: 12px; right: 12px; background: var(--on-primary-container); color: var(--primary-container); font: 700 10px/1 var(--font-body); letter-spacing: .14em; text-transform: uppercase; padding: 5px 8px; border-radius: 4px; }

/* ── Evaluator Card ── */
.evaluator-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
.evaluator-card { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; position: relative; transition: box-shadow .15s; }
.evaluator-card:hover { box-shadow: var(--shadow-md); }
.evaluator-card.recommended { background: var(--primary-container); color: var(--on-primary-container); box-shadow: var(--shadow-lg); border: 2px solid var(--primary); }
.evaluator-ribbon { position: absolute; top: -12px; left: 16px; display: inline-flex; align-items: center; gap: 5px; background: var(--secondary-container); color: var(--on-secondary-container); padding: 4px 10px; border-radius: 9999px; font: 700 12px/1 var(--font-body); }
.evaluator-card.recommended .evaluator-ribbon { background: var(--inverse-primary); color: var(--primary); }
.evaluator-card h3 { margin: 0; font: 600 22px/1.3 var(--font-display); }
.evaluator-sub { margin: 0; font: 600 12px/1.4 var(--font-body); color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .08em; }
.evaluator-card.recommended .evaluator-sub { color: rgba(255,255,255,.85); }
.evaluator-metric { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--outline-variant); padding-bottom: 8px; }
.evaluator-card.recommended .evaluator-metric { border-color: rgba(255,255,255,.3); }
.evaluator-metric span { color: var(--on-surface-variant); font: 400 14px/1.4 var(--font-body); }
.evaluator-card.recommended .evaluator-metric span { color: rgba(255,255,255,.85); }
.evaluator-metric b { font: 600 22px/1 var(--font-display); color: var(--secondary); }
.evaluator-card.recommended .evaluator-metric b { color: #fff; }
.evaluator-card ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.evaluator-card li { display: flex; gap: 8px; align-items: flex-start; font: 400 14px/1.5 var(--font-body); color: var(--on-surface-variant); }
.evaluator-card.recommended li { color: rgba(255,255,255,.95); }
.skip-evaluation { margin-top: 16px; text-align: center; }

/* ── Specialist Card ── */
.specialist-card { background: rgba(255,255,255,.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--outline-variant); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.specialist-card h4 { margin: 0; font: 600 22px/1.3 var(--font-display); color: var(--primary); }
.specialist-card > p { margin: 0; font: 400 14px/1.55 var(--font-body); color: var(--on-surface-variant); }
.specialist-row { display: flex; align-items: center; gap: 12px; }
.avatar-lg { width: 44px; height: 44px; border-radius: 9999px; background: var(--primary-fixed); color: var(--on-primary-fixed); display: flex; align-items: center; justify-content: center; font: 700 15px/1 var(--font-body); border: 1px solid var(--outline-variant); }
.specialist-name { margin: 0; font: 700 14px/1.3 var(--font-body); }
.specialist-role { margin: 0; font: 400 12px/1.3 var(--font-body); color: var(--on-surface-variant); }

/* ── Oversight Disclaimer ── */
.oversight { margin-top: 48px; padding: 24px; background: var(--surface-container-low); border: 1px solid var(--outline-variant); border-radius: 24px; display: flex; align-items: center; gap: 24px; }
.oversight-icon { width: 64px; height: 64px; border-radius: 9999px; background: var(--secondary-container); color: var(--on-secondary-container); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.oversight-icon .material-symbols-outlined { font-size: 32px; }
.oversight-body { flex: 1; }
.oversight-body h4 { margin: 0 0 4px; font: 600 18px/1.3 var(--font-display); color: var(--primary); }
.oversight-body p { margin: 0; font: 400 14px/1.5 var(--font-body); color: var(--on-surface-variant); }

/* ── Tasks (read-only) ── */
.task-list { display: flex; flex-direction: column; gap: 12px; }
.task-row { display: flex; gap: 14px; align-items: flex-start; padding: 14px; border: 1px solid var(--outline-variant); border-radius: 8px; background: var(--surface-container-lowest); }
.task-status-dot { flex-shrink: 0; width: 12px; height: 12px; border-radius: 9999px; margin-top: 5px; }
.task-status-dot.priority  { background: var(--error); }
.task-status-dot.completed { background: var(--secondary); }
.task-status-dot.upcoming  { background: var(--outline); }
.task-body { flex: 1; }
.task-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.task-head h4 { margin: 0; font: 700 14px/1.4 var(--font-body); }
.task-body p { margin: 4px 0 0; font: 400 13px/1.5 var(--font-body); color: var(--on-surface-variant); }

/* ── Progress Bar ── */
.bar { height: 14px; background: var(--surface-container-highest); border-radius: 9999px; overflow: hidden; }
.bar > i { display: block; height: 100%; background: var(--primary); border-radius: 9999px; transition: width .3s ease; }
.kv-stack { display: flex; flex-direction: column; gap: 8px; }
.kv-row { display: flex; justify-content: space-between; font: 400 14px/1.4 var(--font-body); color: var(--on-surface-variant); }
.kv-row b { color: var(--on-surface); font-weight: 700; }

/* ── Calendar ── */
.cal-nav { display: flex; align-items: center; gap: 8px; font: 700 13px/1 var(--font-body); }
.cal-nav button { background: transparent; border: none; padding: 4px; border-radius: 4px; cursor: pointer; }
.cal-nav button:hover { background: var(--surface-container-high); }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; }
.cal-dow { font: 700 11px/1.2 var(--font-body); color: var(--on-surface-variant); margin-bottom: 6px; }
.cal-day { padding: 8px 0; font: 400 14px/1 var(--font-body); }
.cal-dim { color: var(--outline); }
.cal-pick { background: var(--primary-container); color: var(--on-primary-container); border-radius: 9999px; font-weight: 700; }
.cal-deadline { position: relative; }
.cal-deadline::after { content: ""; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--error); border-radius: 9999px; }
.cal-legend { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--outline-variant); display: flex; gap: 10px; align-items: flex-start; }
.cal-legend-dot { width: 8px; height: 8px; background: var(--error); border-radius: 9999px; margin-top: 6px; flex-shrink: 0; }
.cal-legend-title { margin: 0; font: 700 12px/1.4 var(--font-body); }
.cal-legend-sub { margin: 0; font: 400 10px/1.4 var(--font-body); color: var(--on-surface-variant); text-transform: uppercase; letter-spacing: .06em; }

/* ── Welcome ── */
.welcome-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: stretch; }
.welcome-hero { background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); border-radius: 24px; padding: 48px; display: flex; flex-direction: column; gap: 24px; justify-content: center; }
.welcome-hero h1 { font-size: 48px; margin: 0; }
.welcome-side { display: flex; flex-direction: column; gap: 24px; }
.image-card { height: 280px; background: linear-gradient(135deg, #ffb598 0%, #bc5629 100%); border-radius: 16px; position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 18px; color: #fff; }
.image-card-caption { font: 400 14px/1.4 var(--font-body); background: rgba(32,27,15,.5); backdrop-filter: blur(2px); padding: 6px 10px; border-radius: 8px; }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
@media (max-width: 900px) { .welcome-grid { grid-template-columns: 1fr; } }

/* ── Plan layout ── */
.plan-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 24px; }
@media (max-width: 1024px) { .plan-grid { grid-template-columns: 1fr; } }

/* ── Tag chip row ── */
.tag-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.tag-row .pill { background: var(--surface-container-high); color: var(--on-surface-variant); }
.tag-row .pill.tag-primary { background: var(--secondary-container); color: var(--on-secondary-container); }

/* ── Success / Complete ── */
.success { display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; max-width: 520px; margin: 48px auto; padding: 48px 24px; }
.success-icon { width: 96px; height: 96px; border-radius: 9999px; background: var(--secondary-container); color: var(--on-secondary-container); display: flex; align-items: center; justify-content: center; }
.success-icon .material-symbols-outlined { font-size: 56px; font-variation-settings: 'FILL' 1; }

/* ── Decorative blob ── */
.deco-blob { position: fixed; top: 80px; right: -40px; width: 280px; height: 280px; opacity: .08; pointer-events: none; z-index: 0; }
@media (max-width: 1100px) { .deco-blob { display: none; } }

/* ── Mobile ── */
@media (max-width: 768px) {
  .stepper { display: none; }
  .canvas { padding: 24px 16px 24px; }
  .topnav { padding: 0 16px; }
}

/* ── Print ── */
@media print {
  .topnav, .stepper, .deco-blob, .row-actions, .specialist-card { display: none !important; }
  .shell { display: block; }
  .canvas { padding: 0; overflow: visible; }
  body { background: #fff; color: #000; }
  .card, .task-row { break-inside: avoid; }
  .plan-grid { grid-template-columns: 1fr; }
  h1.display { font-size: 28px; }
}
```

- [ ] **Step 3: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pathfinder — Credential Translation for Immigrants & Refugees',
  description: 'Map your foreign credentials to US equivalents and build a SMART recertification plan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create `src/app/page.tsx` placeholder (will be replaced in Task 8)**

```tsx
export default function Home() {
  return <div>Pathfinder loading…</div>;
}
```

- [ ] **Step 5: Start dev server to verify fonts and tokens load**

```bash
npm run dev
```

Open http://localhost:3000 — should show "Pathfinder loading…" in Atkinson Hyperlegible Next font on a cream background. Check DevTools → Network to confirm Google Fonts CSS is loading.

- [ ] **Step 6: Commit**

```bash
git add src/ public/ next.config.js tsconfig.json package.json
git commit -m "feat: add design tokens, layout, and CSS design system"
```

---

## Task 3: Types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Create `src/types.ts`**

```ts
export type Screen =
  | 'welcome'
  | 'identity'
  | 'education'
  | 'documents'
  | 'budget'
  | 'pathway'
  | 'verification'
  | 'plan'
  | 'complete';

export type Profession =
  | 'doctor'
  | 'nurse'
  | 'engineer'
  | 'teacher'
  | 'architect'
  | 'other';

export type DegreeLevel =
  | 'high_school'
  | 'associate'
  | 'bachelor'
  | 'master'
  | 'doctoral'
  | 'professional';

export type CredentialType =
  | 'degree'
  | 'license'
  | 'certification'
  | 'diploma'
  | 'other_credential';

export type DocSituation = 'all' | 'partial' | 'none' | 'destroyed';

export interface AppState {
  screen: Screen;
  // identity
  profession: Profession;
  otherProfession: string;
  country: string;
  usState: string;
  // education
  degreeLevel: DegreeLevel;
  credentialType: CredentialType;
  fieldOfStudy: string;
  institutionName: string;
  institutionCountry: string;
  graduationYear: string;
  // documents
  docSituation: DocSituation;
  // budget
  budget: number;
  months: number;
  // pathway + verification
  pickedPathway: number;
  pickedEvaluator: number | null; // null = skipped
}

export interface Pathway {
  icon: string;
  title: string;
  time: string;
  cost: string;
  confidence: 'High' | 'Medium' | 'Low';
  desc: string;
  recommended?: boolean;
}

export interface Evaluator {
  name: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  ribbon: { icon: string; label: string };
  bullets: string[];
}

export interface Task {
  id: number;
  title: string;
  desc: string;
  status: 'priority' | 'completed' | 'upcoming';
  statusLabel: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 4: Chrome Components

**Files:**
- Create: `src/components/Chrome.tsx`

Includes: `TopNavBar` (no language toggle), `JourneyStepper` (9 steps including Education), `WhyDoWeNeedThis`.

- [ ] **Step 1: Create `src/components/Chrome.tsx`**

```tsx
'use client';

import { Screen } from '@/types';

const STEPS: { id: Screen; label: string; icon: string }[] = [
  { id: 'identity',     label: 'Identity',    icon: 'person' },
  { id: 'education',    label: 'Education',   icon: 'school' },
  { id: 'documents',    label: 'Documents',   icon: 'description' },
  { id: 'budget',       label: 'Budget',      icon: 'savings' },
  { id: 'pathway',      label: 'Pathway',     icon: 'route' },
  { id: 'verification', label: 'Verification',icon: 'verified' },
  { id: 'plan',         label: 'SMART Plan',  icon: 'assignment_turned_in' },
  { id: 'complete',     label: 'Complete',    icon: 'check_circle' },
];

export function TopNavBar() {
  return (
    <header className="topnav">
      <div className="topnav-brand">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1", color: 'var(--primary)', fontSize: 28 }}
        >
          route
        </span>
        <span className="wordmark">Pathfinder</span>
      </div>
      <div className="topnav-right">
        <div className="avatar" aria-label="User profile">YO</div>
      </div>
    </header>
  );
}

interface StepperProps {
  activeId: Screen;
  completedIds: Screen[];
}

export function JourneyStepper({ activeId, completedIds }: StepperProps) {
  return (
    <aside className="stepper">
      <div className="stepper-head">
        <div className="stepper-mark">
          <span className="material-symbols-outlined">route</span>
        </div>
        <div>
          <h2>Your Journey</h2>
          <p>9 Steps to Success</p>
        </div>
      </div>
      <nav>
        {STEPS.map((s) => {
          const done = completedIds.includes(s.id);
          const active = s.id === activeId;
          const cls = active ? 'step active' : done ? 'step done' : 'step upcoming';
          return (
            <span key={s.id} className={cls}>
              <span
                className="material-symbols-outlined"
                style={done && !active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {done && !active ? 'check_circle' : s.icon}
              </span>
              <span>{s.label}</span>
            </span>
          );
        })}
      </nav>
      <div className="stepper-support">
        <button className="btn-outline" style={{ width: '100%' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>help_outline</span>
          View Support
        </button>
      </div>
    </aside>
  );
}

export function WhyDoWeNeedThis({ children }: { children: React.ReactNode }) {
  return (
    <div className="why-block">
      <span
        className="material-symbols-outlined"
        style={{ color: 'var(--secondary)', fontVariationSettings: "'FILL' 1", flexShrink: 0 }}
      >
        info
      </span>
      <div>
        <p className="why-title">Why do we need this?</p>
        <p className="why-body">{children}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Chrome.tsx
git commit -m "feat: add TopNavBar, JourneyStepper, WhyDoWeNeedThis components"
```

---

## Task 5: Form Components

**Files:**
- Create: `src/components/Form.tsx`

- [ ] **Step 1: Create `src/components/Form.tsx`**

```tsx
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
      <div className={`field ${noIcon ? 'field-no-icon' : ''}`}>
        {icon && !noIcon && (
          <span className="material-symbols-outlined field-icon">{icon}</span>
        )}
        {children}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectInput({ id, value, onChange, options, placeholder }: SelectProps) {
  return (
    <>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
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
      className={`radio-card ${selected ? 'selected' : ''}`}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Form.tsx
git commit -m "feat: add form primitive components"
```

---

## Task 6: Cards Components

**Files:**
- Create: `src/components/Cards.tsx`

- [ ] **Step 1: Create `src/components/Cards.tsx`**

```tsx
'use client';

import { Pathway, Evaluator } from '@/types';

export function ConfidenceBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const cls = level.toLowerCase();
  return (
    <span className={`pill conf-${cls}`}>
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

export function PathwayCard({ icon, title, time, cost, desc, confidence, recommended, selected, onSelect }: PathwayCardProps) {
  const isHighlighted = recommended && selected;
  return (
    <div className={`pathway-card ${isHighlighted ? 'recommended' : ''}`}>
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
        className={isHighlighted ? 'btn-on-primary' : 'btn-tonal'}
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

export function EvaluatorCard({ ribbon, name, subtitle, metric, metricLabel, bullets, selected, onSelect }: EvaluatorCardProps) {
  return (
    <div className={`evaluator-card ${selected ? 'recommended' : ''}`}>
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
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: selected ? '#fff' : 'var(--secondary)' }}>
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
        <p>Pathfinder provides these comparisons based on current data. Each credentialing case is unique. We strongly recommend a final review with a Pathfinder advisor before committing.</p>
      </div>
      <button className="btn-outline btn-outline-strong">Talk to Advisor</button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Cards.tsx
git commit -m "feat: add pathway, evaluator, specialist, and oversight card components"
```

---

## Task 7: Tasks Component (Read-Only)

**Files:**
- Create: `src/components/Tasks.tsx`

Note: Tasks are display-only. No checkboxes — the SMART plan is generated output, not an interactive to-do list.

- [ ] **Step 1: Create `src/components/Tasks.tsx`**

```tsx
'use client';

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
      <div className="bar"><i style={{ width: pct + '%' }} /></div>
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

interface CalendarProps {
  month: string;
  year: number;
  picked: number;
  deadlines: number[];
}

export function TimeBoundCalendar({ month, year, picked, deadlines }: CalendarProps) {
  const days = Array.from({ length: 35 }, (_, i) => i - 1);
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
        {days.map((d) => {
          if (d < 1 || d > 31) return <div key={'p' + d} className="cal-day cal-dim">{d <= 0 ? 30 + d : d - 31}</div>;
          const isPicked = d === picked;
          const isDeadline = deadlines.includes(d);
          return (
            <div key={d} className={`cal-day ${isPicked ? 'cal-pick ' : ''}${isDeadline ? 'cal-deadline' : ''}`}>{d}</div>
          );
        })}
      </div>
      <div className="cal-legend">
        <span className="cal-legend-dot" />
        <div>
          <p className="cal-legend-title">Deadline: Step 1 Registration</p>
          <p className="cal-legend-sub">October 22nd, 2026</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Tasks.tsx
git commit -m "feat: add read-only task row, progress bar, and calendar components"
```

---

## Task 8: App State + Routing

**Files:**
- Modify: `src/app/page.tsx`

This is the root of the app. It holds all state and renders the correct screen.

- [ ] **Step 1: Replace `src/app/page.tsx` with the full app**

```tsx
'use client';

import { useState } from 'react';
import { AppState, Screen, Pathway, Evaluator, Task } from '@/types';
import { TopNavBar, JourneyStepper } from '@/components/Chrome';
import WelcomeScreen from '@/screens/WelcomeScreen';
import IdentityScreen from '@/screens/IdentityScreen';
import EducationScreen from '@/screens/EducationScreen';
import DocumentsScreen from '@/screens/DocumentsScreen';
import BudgetScreen from '@/screens/BudgetScreen';
import PathwayScreen from '@/screens/PathwayScreen';
import VerificationScreen from '@/screens/VerificationScreen';
import PlanScreen from '@/screens/PlanScreen';
import CompleteScreen from '@/screens/CompleteScreen';

const FLOW: Screen[] = [
  'welcome', 'identity', 'education', 'documents',
  'budget', 'pathway', 'verification', 'plan', 'complete',
];

// Screens that show in the stepper (welcome is fullscreen)
const STEPPER_SCREENS: Screen[] = [
  'identity', 'education', 'documents', 'budget',
  'pathway', 'verification', 'plan', 'complete',
];

export const PATHWAYS: Pathway[] = [
  { icon: 'group_add', title: 'PA (Bridge Track)', time: '24 Months', cost: '$2,000+', confidence: 'High', desc: 'A specialized track for IMGs that leverages prior medical training.', recommended: true },
  { icon: 'medical_services', title: 'Medical Scribe', time: '3-6 Months', cost: '$300 - $800', confidence: 'High', desc: 'Gain US clinical environment exposure and work alongside clinicians.' },
  { icon: 'science', title: 'Clinical Research Asst.', time: '6-9 Months', cost: '$500 - $1,200', confidence: 'High', desc: 'Apply analytical skills to manage data and patient protocols.' },
  { icon: 'medication', title: 'Pharmacy Technician', time: '4-12 Months', cost: '$200 - $1,500', confidence: 'Medium', desc: 'Apply your pharmacology knowledge in retail or hospital settings.' },
];

export const EVALUATORS: Evaluator[] = [
  { name: 'Josef Silny', subtitle: 'NACES Member', metric: '$90 USD', metricLabel: 'Starting from', ribbon: { icon: 'payments', label: 'Cheapest' }, bullets: ['Best value for general evaluations', '10-15 business day turnaround', 'Translation services available'] },
  { name: 'WES', subtitle: 'World Education Services', metric: '7 Days', metricLabel: 'Turnaround', ribbon: { icon: 'speed', label: 'Fastest' }, bullets: ['Digital badge integration included', 'Recognized by 2,500+ institutions', 'Robust online document portal'] },
  { name: 'ECFMG', subtitle: 'Medical Professionals', metric: 'Clinical', metricLabel: 'Focus', ribbon: { icon: 'medical_services', label: 'Best for Medical' }, bullets: ['Required for USMLE pathways', 'Specialized residency reporting', 'Verification at source (EPIC)'] },
];

export const PLAN_TASKS: Task[] = [
  { id: 1, title: 'Submit WES Evaluation', desc: 'Request official transcripts from your degree-granting institution.', status: 'priority', statusLabel: 'High Priority' },
  { id: 2, title: 'Register for Step 1', desc: 'USMLE application submitted — confirm receipt.', status: 'completed', statusLabel: 'Completed' },
  { id: 3, title: 'Background Check Authorization', desc: 'Provide digital signature for state-level clearance.', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 4, title: 'Schedule TOEFL Exam', desc: 'Book your earliest available test center slot.', status: 'upcoming', statusLabel: 'Upcoming' },
];

const INITIAL_STATE: AppState = {
  screen: 'welcome',
  profession: 'doctor',
  otherProfession: '',
  country: 'Syria',
  usState: 'NY',
  degreeLevel: 'bachelor',
  credentialType: 'degree',
  fieldOfStudy: '',
  institutionName: '',
  institutionCountry: '',
  graduationYear: '',
  docSituation: 'partial',
  budget: 2000,
  months: 24,
  pickedPathway: 0,
  pickedEvaluator: 1,
};

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const update = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }));

  const next = () => {
    const i = FLOW.indexOf(state.screen);
    if (i < FLOW.length - 1) update({ screen: FLOW[i + 1] });
  };

  const back = () => {
    const i = FLOW.indexOf(state.screen);
    if (i > 0) update({ screen: FLOW[i - 1] });
  };

  const screenIdx = FLOW.indexOf(state.screen);
  const stepperScreenIdx = STEPPER_SCREENS.indexOf(state.screen);
  const completedIds = stepperScreenIdx > 0
    ? STEPPER_SCREENS.slice(0, stepperScreenIdx) as Screen[]
    : [];

  const showShell = state.screen !== 'welcome';

  return (
    <div className="app">
      <img src="/blob.svg" className="deco-blob" aria-hidden="true" alt="" />
      <TopNavBar />

      {showShell ? (
        <div className="shell">
          <JourneyStepper activeId={state.screen} completedIds={completedIds} />
          <main className="canvas">
            {state.screen === 'identity'     && <IdentityScreen state={state} update={update} onBack={back} onContinue={next} />}
            {state.screen === 'education'    && <EducationScreen state={state} update={update} onBack={back} onContinue={next} />}
            {state.screen === 'documents'    && <DocumentsScreen state={state} update={update} onBack={back} onContinue={next} />}
            {state.screen === 'budget'       && <BudgetScreen state={state} update={update} onBack={back} onContinue={next} />}
            {state.screen === 'pathway'      && <PathwayScreen state={state} update={update} onBack={back} onContinue={next} />}
            {state.screen === 'verification' && <VerificationScreen state={state} update={update} onBack={back} onContinue={next} />}
            {state.screen === 'plan'         && <PlanScreen state={state} onBack={back} onContinue={next} />}
            {state.screen === 'complete'     && <CompleteScreen onRestart={() => setState(INITIAL_STATE)} />}
          </main>
        </div>
      ) : (
        <main className="canvas" style={{ padding: '48px' }}>
          <WelcomeScreen onContinue={next} />
        </main>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create the `src/screens/` directory**

```bash
mkdir src\screens
```

- [ ] **Step 3: Commit placeholder**

```bash
git add src/app/page.tsx
git commit -m "feat: add app state, routing, and data constants"
```

---

## Task 9: Welcome Screen

**Files:**
- Create: `src/screens/WelcomeScreen.tsx`

No language picker. Hero card + feature summary only.

- [ ] **Step 1: Create `src/screens/WelcomeScreen.tsx`**

```tsx
'use client';

interface Props { onContinue: () => void; }

export default function WelcomeScreen({ onContinue }: Props) {
  return (
    <div className="canvas-wide section-stack">
      <div className="welcome-grid">
        <div className="welcome-hero">
          <span className="pill status-completed" style={{ alignSelf: 'flex-start' }}>
            New Arrivals Support
          </span>
          <h1 className="display">Your skills travel with you. Let's find your path in the US.</h1>
          <p className="lead">
            Navigate the complex process of foreign credential recognition and professional licensing
            with a steadfast partner. We help you unlock your professional future.
          </p>
          <div>
            <button className="btn-primary" onClick={onContinue}>Get Started</button>
          </div>
        </div>
        <div className="welcome-side">
          <div className="image-card">
            <p className="image-card-caption">Diverse professionals collaborating in a sun-drenched workspace.</p>
          </div>
        </div>
      </div>
      <div className="feature-grid">
        {[
          { icon: 'verified_user', title: 'Credential Verification', desc: 'Securely map your educational history to US standards.' },
          { icon: 'route',         title: 'Career Pathways',         desc: 'Clear, step-by-step roadmaps for your profession.' },
          { icon: 'support_agent', title: 'Human Support',           desc: 'Expert guidance to overcome bureaucratic hurdles.' },
        ].map((item) => (
          <div key={item.title} className="card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 36 }}>{item.icon}</span>
            <div>
              <h3 style={{ margin: '0 0 4px', font: '600 16px/1.3 var(--font-body)' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--on-surface-variant)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/WelcomeScreen.tsx
git commit -m "feat: add WelcomeScreen without language picker"
```

---

## Task 10: Identity Screen

**Files:**
- Create: `src/screens/IdentityScreen.tsx`

When "Other Professional" is selected, a text input appears asking "Please describe your profession."

- [ ] **Step 1: Create `src/screens/IdentityScreen.tsx`**

```tsx
'use client';

import { AppState, Profession } from '@/types';
import { Field, SelectInput, TextInput } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

const PROFESSIONS = [
  { value: 'doctor',    label: 'Doctor / Physician' },
  { value: 'nurse',     label: 'Registered Nurse' },
  { value: 'engineer',  label: 'Civil / Mechanical Engineer' },
  { value: 'teacher',   label: 'Primary / Secondary Teacher' },
  { value: 'architect', label: 'Architect' },
  { value: 'other',     label: 'Other Professional' },
];

const US_STATES = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'IL', label: 'Illinois' },
  { value: 'WA', label: 'Washington' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'GA', label: 'Georgia' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'MI', label: 'Michigan' },
];

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function IdentityScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 1 of 8</span>
          <h1 className="display">Tell Us About You</h1>
          <p className="lead">
            We use this information to customize your professional credentialing pathway.
            All data is handled securely.
          </p>
        </div>

        <div className="card" style={{ padding: 32, gap: 24 }}>
          <Field label="What was your profession in your home country?" htmlFor="prof" icon="work">
            <SelectInput
              id="prof"
              value={state.profession}
              onChange={(v) => update({ profession: v as Profession, otherProfession: '' })}
              options={PROFESSIONS}
              placeholder="Search or select a profession"
            />
          </Field>

          {state.profession === 'other' && (
            <Field label="Please describe your profession" htmlFor="otherProf" icon="edit">
              <TextInput
                id="otherProf"
                value={state.otherProfession}
                onChange={(v) => update({ otherProfession: v })}
                placeholder="e.g. Dentist, Veterinarian, Pharmacist…"
              />
            </Field>
          )}

          <Field label="Which country did you earn your degree in?" htmlFor="country" icon="public">
            <TextInput
              id="country"
              value={state.country}
              onChange={(v) => update({ country: v })}
              placeholder="Enter country name"
            />
          </Field>

          <Field label="Which US state do you live in now?" htmlFor="state" icon="location_on">
            <SelectInput
              id="state"
              value={state.usState}
              onChange={(v) => update({ usState: v })}
              options={US_STATES}
              placeholder="Select a state"
            />
          </Field>

          <div className="row-actions">
            <button className="btn-secondary" onClick={onBack}>Back</button>
            <button className="btn-primary" onClick={onContinue}>Continue to Education</button>
          </div>
        </div>
      </div>

      <WhyDoWeNeedThis>
        Credentialing requirements vary significantly by state and professional background. Providing
        accurate details ensures your pathway includes the specific boards and agencies you'll need
        to contact.
      </WhyDoWeNeedThis>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/IdentityScreen.tsx
git commit -m "feat: add IdentityScreen with Other Professional text input"
```

---

## Task 11: Education Screen

**Files:**
- Create: `src/screens/EducationScreen.tsx`

New screen. Fields: degree level, credential type, field of study, institution name, institution country, graduation year.

- [ ] **Step 1: Create `src/screens/EducationScreen.tsx`**

```tsx
'use client';

import { AppState, DegreeLevel, CredentialType } from '@/types';
import { Field, SelectInput, TextInput } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

const DEGREE_LEVELS = [
  { value: 'high_school',   label: 'High School / Secondary' },
  { value: 'associate',     label: 'Associate Degree (2 years)' },
  { value: 'bachelor',      label: 'Bachelor\'s Degree (4 years)' },
  { value: 'master',        label: 'Master\'s Degree' },
  { value: 'doctoral',      label: 'Doctoral Degree (PhD, EdD)' },
  { value: 'professional',  label: 'Professional Degree (MD, JD, DDS…)' },
];

const CREDENTIAL_TYPES = [
  { value: 'degree',            label: 'Academic Degree' },
  { value: 'license',           label: 'Professional License' },
  { value: 'certification',     label: 'Professional Certification' },
  { value: 'diploma',           label: 'Diploma / Vocational Certificate' },
  { value: 'other_credential',  label: 'Other Credential' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function EducationScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 2 of 8</span>
          <h1 className="display">Your Education</h1>
          <p className="lead">
            Tell us about the highest qualification you earned in your home country.
            This helps us find the closest US equivalents and identify the right evaluator.
          </p>
        </div>

        <div className="card" style={{ padding: 32, gap: 24 }}>
          <Field label="Highest degree or qualification level" htmlFor="degree" icon="school">
            <SelectInput
              id="degree"
              value={state.degreeLevel}
              onChange={(v) => update({ degreeLevel: v as DegreeLevel })}
              options={DEGREE_LEVELS}
              placeholder="Select degree level"
            />
          </Field>

          <Field label="Type of credential" htmlFor="credType" icon="verified">
            <SelectInput
              id="credType"
              value={state.credentialType}
              onChange={(v) => update({ credentialType: v as CredentialType })}
              options={CREDENTIAL_TYPES}
              placeholder="Select credential type"
            />
          </Field>

          <Field label="Field of study or specialization" htmlFor="field" icon="biotech">
            <TextInput
              id="field"
              value={state.fieldOfStudy}
              onChange={(v) => update({ fieldOfStudy: v })}
              placeholder="e.g. General Medicine, Civil Engineering, Elementary Education"
            />
          </Field>

          <Field label="Institution name" htmlFor="institution" icon="account_balance">
            <TextInput
              id="institution"
              value={state.institutionName}
              onChange={(v) => update({ institutionName: v })}
              placeholder="e.g. University of Damascus, Cairo University"
            />
          </Field>

          <Field label="Country where institution is located" htmlFor="instCountry" icon="public">
            <TextInput
              id="instCountry"
              value={state.institutionCountry}
              onChange={(v) => update({ institutionCountry: v })}
              placeholder="Enter country name"
            />
          </Field>

          <Field label="Year of graduation or completion" htmlFor="gradYear" icon="event">
            <SelectInput
              id="gradYear"
              value={state.graduationYear}
              onChange={(v) => update({ graduationYear: v })}
              options={YEARS}
              placeholder="Select year"
            />
          </Field>

          <div className="row-actions">
            <button className="btn-secondary" onClick={onBack}>Back</button>
            <button className="btn-primary" onClick={onContinue}>Continue to Documents</button>
          </div>
        </div>
      </div>

      <WhyDoWeNeedThis>
        US credential evaluators and licensing boards use your degree level, field, and institution
        to determine equivalency. Accurate information here avoids delays or rejections at the
        evaluation stage.
      </WhyDoWeNeedThis>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/EducationScreen.tsx
git commit -m "feat: add EducationScreen with degree level, credential type, and institution fields"
```

---

## Task 12: Documents Screen

**Files:**
- Create: `src/screens/DocumentsScreen.tsx`

- [ ] **Step 1: Create `src/screens/DocumentsScreen.tsx`**

```tsx
'use client';

import { AppState, DocSituation } from '@/types';
import { RadioCard } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

const DOC_OPTIONS: { id: DocSituation; icon: string; title: string; desc: string }[] = [
  { id: 'all',       icon: 'folder_zip',  title: 'I have all my documents',         desc: 'Diplomas, transcripts, and licenses are with me.' },
  { id: 'partial',   icon: 'description', title: 'I have some documents',            desc: 'I have a few — others are missing or back home.' },
  { id: 'none',      icon: 'help_outline',title: 'I have nothing on paper',          desc: 'I had to leave without any official records.' },
  { id: 'destroyed', icon: 'event_busy',  title: 'My institution no longer exists',  desc: 'My university or licensing body has closed.' },
];

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function DocumentsScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack">
        <div>
          <span className="eyebrow">Step 3 of 8</span>
          <h1 className="display">Your Documents Situation</h1>
          <p className="lead">
            Many people arrive without their original credentials. Tell us where you stand —
            there's a path either way.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DOC_OPTIONS.map((o) => (
            <RadioCard
              key={o.id}
              icon={o.icon}
              title={o.title}
              desc={o.desc}
              selected={state.docSituation === o.id}
              onSelect={() => update({ docSituation: o.id })}
            />
          ))}
        </div>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Continue to Budget</button>
        </div>
      </div>

      <WhyDoWeNeedThis>
        If your documents are unavailable, we'll route you toward bridging programs and
        refugee-credentialing attorneys who can help reconstruct your record.
      </WhyDoWeNeedThis>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/DocumentsScreen.tsx
git commit -m "feat: add DocumentsScreen"
```

---

## Task 13: Budget Screen

**Files:**
- Create: `src/screens/BudgetScreen.tsx`

- [ ] **Step 1: Create `src/screens/BudgetScreen.tsx`**

```tsx
'use client';

import { AppState } from '@/types';
import { RangeSlider } from '@/components/Form';
import { WhyDoWeNeedThis } from '@/components/Chrome';

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function BudgetScreen({ state, update, onBack, onContinue }: Props) {
  return (
    <div className="canvas-narrow">
      <div className="section-stack">
        <div>
          <span className="eyebrow">Step 4 of 8</span>
          <h1 className="display">Your Time & Money Budget</h1>
          <p className="lead">
            We'll show pathways that fit your real constraints — not the theoretical fastest route.
          </p>
        </div>

        <div className="card" style={{ padding: 32, gap: 32 }}>
          <RangeSlider
            label="Money you can invest"
            value={state.budget}
            min={0}
            max={20000}
            step={500}
            onChange={(v) => update({ budget: v })}
            format={(v) => '$' + v.toLocaleString()}
          />
          <RangeSlider
            label="Time you can commit"
            value={state.months}
            min={3}
            max={60}
            step={1}
            onChange={(v) => update({ months: v })}
            format={(v) => v + ' Months'}
          />
        </div>

        <div className="row-actions">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onContinue}>Find My Pathways</button>
        </div>
      </div>

      <WhyDoWeNeedThis>
        We present cost and time as ranges, with the assumptions stated. If your budget makes the
        standard route unrealistic, we'll show you adjacent bridge roles.
      </WhyDoWeNeedThis>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/BudgetScreen.tsx
git commit -m "feat: add BudgetScreen with sliders"
```

---

## Task 14: Pathway Screen

**Files:**
- Create: `src/screens/PathwayScreen.tsx`

Recommended card is always rendered first (index 0 in PATHWAYS constant is the recommended one).

- [ ] **Step 1: Create `src/screens/PathwayScreen.tsx`**

```tsx
'use client';

import { AppState } from '@/types';
import { PATHWAYS } from '@/app/page';
import { PathwayCard } from '@/components/Cards';

const PROFESSION_LABELS: Record<string, string> = {
  doctor:    'Doctor / Physician',
  nurse:     'Registered Nurse',
  engineer:  'Civil / Mechanical Engineer',
  teacher:   'Primary / Secondary Teacher',
  architect: 'Architect',
  other:     'Other Professional',
};

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function PathwayScreen({ state, update, onBack, onContinue }: Props) {
  const profLabel = state.profession === 'other' && state.otherProfession
    ? state.otherProfession
    : PROFESSION_LABELS[state.profession] ?? 'Professional';

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <div className="tag-row">
            <span className="pill tag-primary">{profLabel}</span>
            <span className="pill">Budget: ${state.budget.toLocaleString()}</span>
            <span className="pill">Time: {state.months} Months</span>
          </div>
          <h1 className="display">Matching Your Situation</h1>
          <p className="lead">
            Based on your profile, we have identified bridge roles and career steps that honor your
            expertise while fitting within your constraints.
          </p>
        </div>

        <div className="pathway-grid">
          {PATHWAYS.map((p, i) => (
            <PathwayCard
              key={p.title}
              {...p}
              selected={state.pickedPathway === i}
              onSelect={() => update({ pickedPathway: i })}
            />
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
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/PathwayScreen.tsx
git commit -m "feat: add PathwayScreen with recommended card first"
```

---

## Task 15: Verification Screen (NACES + Skip)

**Files:**
- Create: `src/screens/VerificationScreen.tsx`

"Skip" link sets `pickedEvaluator` to `null` and calls `onContinue`.

- [ ] **Step 1: Create `src/screens/VerificationScreen.tsx`**

```tsx
'use client';

import { AppState } from '@/types';
import { EVALUATORS } from '@/app/page';
import { EvaluatorCard, HumanOversightDisclaimer } from '@/components/Cards';

interface Props {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function VerificationScreen({ state, update, onBack, onContinue }: Props) {
  const handleSkip = () => {
    update({ pickedEvaluator: null });
    onContinue();
  };

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div>
          <span className="eyebrow">Step 6 of 8 · NACES</span>
          <h1 className="display">NACES Evaluator Picker</h1>
          <p className="lead">
            Compare approved NACES member organizations to find the best fit for your specific
            professional and academic requirements.
          </p>
        </div>

        <div className="evaluator-grid" style={{ marginTop: 16 }}>
          {EVALUATORS.map((e, i) => (
            <EvaluatorCard
              key={e.name}
              {...e}
              selected={state.pickedEvaluator === i}
              onSelect={() => update({ pickedEvaluator: i })}
            />
          ))}
        </div>

        <div className="skip-evaluation">
          <button className="btn-text-link" onClick={handleSkip}>
            Skip — I'll arrange evaluation later
          </button>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/VerificationScreen.tsx
git commit -m "feat: add VerificationScreen with NACES evaluator cards and skip option"
```

---

## Task 16: Plan Screen (Read-Only + Print PDF)

**Files:**
- Create: `src/screens/PlanScreen.tsx`

No checkboxes. Tasks are display-only with status dots. Single "Print PDF" button triggers `window.print()`.

- [ ] **Step 1: Create `src/screens/PlanScreen.tsx`**

```tsx
'use client';

import { AppState } from '@/types';
import { PLAN_TASKS } from '@/app/page';
import { TaskRow, MeasurableProgress, TimeBoundCalendar } from '@/components/Tasks';
import { SpecialistCard } from '@/components/Cards';

interface Props {
  state: AppState;
  onBack: () => void;
  onContinue: () => void;
}

export default function PlanScreen({ state, onBack, onContinue }: Props) {
  const completedCount = PLAN_TASKS.filter((t) => t.status === 'completed').length;
  const donePct = Math.round((completedCount / PLAN_TASKS.length) * 100);

  return (
    <div className="canvas-wide">
      <div className="section-stack" style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow">Strategy Phase</span>
            <h1 className="display">SMART Recertification Plan</h1>
            <p className="lead">
              Your structured roadmap for the next 90 days. We've broken down your credential
              recertification into actionable, measurable steps.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn-outline"
              onClick={() => window.print()}
            >
              <span className="material-symbols-outlined">print</span>
              Print PDF
            </button>
            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined">support_agent</span>
              Talk to a Specialist
            </button>
          </div>
        </div>

        <div className="plan-grid">
          <div className="section-stack">
            <section className="card">
              <div className="card-head" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)', padding: 6, borderRadius: 8 }}
                  >
                    checklist
                  </span>
                  <h3>Specific Tasks</h3>
                </div>
              </div>
              <div className="task-list">
                {PLAN_TASKS.map((t) => <TaskRow key={t.id} task={t} />)}
              </div>
            </section>
          </div>

          <div className="section-stack">
            <MeasurableProgress
              pct={donePct}
              rows={[
                { label: 'Documents Verified', value: '5 / 8' },
                { label: 'Exam Prep Modules',  value: '12 / 15' },
                { label: 'State Approvals',    value: '1 / 4' },
              ]}
            />
            <TimeBoundCalendar month="October" year={2026} picked={15} deadlines={[22]} />
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
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/PlanScreen.tsx
git commit -m "feat: add read-only PlanScreen with Print PDF button"
```

---

## Task 17: Complete Screen

**Files:**
- Create: `src/screens/CompleteScreen.tsx`

No dashboard link, no email mention. Two actions only: Print Your Plan + Start Over.

- [ ] **Step 1: Create `src/screens/CompleteScreen.tsx`**

```tsx
'use client';

interface Props { onRestart: () => void; }

export default function CompleteScreen({ onRestart }: Props) {
  return (
    <div className="success">
      <div className="success-icon">
        <span className="material-symbols-outlined">check_circle</span>
      </div>
      <h1 className="display" style={{ color: 'var(--secondary)' }}>Your plan is ready.</h1>
      <p className="lead">
        Your SMART recertification roadmap has been generated. Print it to keep a copy, or start
        over to explore a different pathway.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" onClick={onRestart}>Start Over</button>
        <button
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          onClick={() => window.print()}
        >
          <span className="material-symbols-outlined">print</span>
          Print Your Plan
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/CompleteScreen.tsx
git commit -m "feat: add CompleteScreen with Print Your Plan action only"
```

---

## Task 18: Smoke Test & Final Wiring

**Files:**
- No new files — verify everything wires up correctly.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Click through the full flow manually**

Open http://localhost:3000 and verify:

1. **Welcome** — hero displays, "Get Started" advances to Identity.
2. **Identity** — selecting "Other Professional" reveals a text input. Other selections hide it. "Continue to Education" advances.
3. **Education** — all 6 fields render. Dropdowns populate. "Continue to Documents" advances.
4. **Documents** — 4 radio cards display. Selection highlights the chosen card. "Continue to Budget" advances.
5. **Budget** — sliders move and update displayed values. "Find My Pathways" advances.
6. **Pathway** — **PA (Bridge Track) recommended card renders first** with "RECOMMENDED" chip and terracotta background. Selecting a card updates the selection. "Continue to Verification" advances.
7. **Verification** — 3 evaluator cards render. "Skip — I'll arrange evaluation later" link is visible below the grid; clicking it advances without requiring selection. "Build My SMART Plan" also advances.
8. **Plan** — task list renders with colored status dots (no checkboxes). "Print PDF" triggers the browser print dialog. "Save & Continue" advances.
9. **Complete** — success icon shows. "Print Your Plan" triggers print. "Start Over" resets to Welcome.
10. **Stepper** — correctly marks completed steps with filled check_circle icons.

- [ ] **Step 3: Check print layout**

On the Plan screen, press Ctrl+P (or click "Print PDF"). Verify:
- TopNavBar and stepper are hidden.
- Task list and progress sections are visible.
- Page breaks avoid splitting task rows mid-card.

- [ ] **Step 4: Fix any TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds with 0 TypeScript errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Pathfinder MVP — 9-step credentialing flow"
```

---

## Self-Review Against Spec

| Requirement | Task |
|---|---|
| Remove all multi-language components | Task 4 (no lang toggle in TopNavBar), Task 9 (no lang picker on Welcome) |
| No dashboard, no email updates, no to-do status updates | Task 16 (read-only plan), Task 17 (no dashboard link) |
| "Other Professional" text input | Task 10 |
| NACES skip option | Task 15 |
| Education page with credential type | Task 11 |
| Recommended card first on pathway | Task 8 (PATHWAYS[0] is recommended), Task 14 |
| PDF print only | Task 16 (`window.print()`), Task 2 (print CSS) |
| 9-step flow including Education | Task 8 (FLOW constant) |
| Design tokens faithful to design system | Task 2 (globals.css) |
