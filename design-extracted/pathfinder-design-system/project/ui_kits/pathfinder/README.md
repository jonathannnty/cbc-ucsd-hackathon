# Pathfinder Web App — UI Kit

Pixel-faithful recreation of the Pathfinder credentialing-flow web app, lifted from the source mocks in `stitch_global_credential_bridge/`. The kit is a click-thru prototype, not production code — it cuts corners on data and persistence, and prioritises visual + interaction fidelity for designers using this kit to mock new screens.

## What's in the kit

- `index.html` — the interactive prototype. Click-thru of the 8-step Journey:
  1. **Welcome** (language picker)
  2. **Tell Us About You** (profession + country + state)
  3. **Your Documents Situation** (radio grid)
  4. **Your Time & Money Budget** (sliders)
  5. **Your Career Pathways** (bridge-role bento grid with confidence badges)
  6. **Choose Your Evaluator** (NACES picker — Cheapest / Fastest / Specialised)
  7. **Your SMART Plan** (checklist + measurable progress + time-bound calendar)
  8. **Save Your Plan** (success)
- `App.jsx` — top-level state + screen routing.
- `Chrome.jsx` — `TopNavBar`, `JourneyStepper` (sidebar), `BottomTabBar`, `WhyDoWeNeedThis` callout.
- `Form.jsx` — `Field`, `Select`, `RadioCard`, `RangeSlider`.
- `Cards.jsx` — `PathwayCard`, `EvaluatorCard`, `ConfidenceBadge`, `StatusPill`, `SpecialistCard`.
- `Tasks.jsx` — `TaskRow`, `MeasurableProgress`, `TimeBoundCalendar`.

## Source of truth

Every visual decision (color, spacing, type, padding, hover transition) was lifted from `stitch_global_credential_bridge/*/code.html`. None of it was invented. When a screen had two source mocks (e.g. `tell_us_about_you_1` + `_2`), we picked the more refined one and noted divergences in the JSX comments.

## What's intentionally not here

- Real form validation, persistence, auth.
- Real i18n. The language toggle changes a label only.
- Real NACES integration. The "Start Application" buttons no-op.
- The Compassionate Guidance illustration system — the source mocks rely on stock photography (Google `aida-public` URLs that aren't ours to redistribute), so we use neutral placeholder cards with a description of what the photo should be.
