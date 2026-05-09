# Pathfinder Design System

**Pathfinder** is a credential-translation tool for immigrants and refugees. It maps foreign degrees, licenses, and professional credentials to their nearest U.S. equivalents, then generates a **SMART Recertification Plan** (Specific, Measurable, Achievable, Relevant, Time-bound) tuned to the user's time and money budget. When the user's home-country credential maps cleanly to a U.S. profession, Pathfinder shows that direct route. When it doesn't, Pathfinder proposes adjacent bridge roles.

The product is built around three load-bearing trust commitments:

1. **Confidence levels.** Every credential mapping ships with a labeled confidence (High / Medium / Low) and a one-click handoff to the relevant NACES evaluator — the actual authoritative U.S. body.
2. **Ranges, not points.** Recertification time and cost are presented as ranges with the load-bearing assumptions stated out loud — never as single estimates.
3. **Defer to humans.** Where model confidence is low, the tool actively de-emphasizes its own output and routes the user toward refugee-resettlement agencies or immigration-credentialing attorneys.

The audience is high-stakes: a Syrian civil engineer or an Eritrean nurse where bad advice costs *years*, not days. The visual language is therefore deliberately **calm, generous, parchment-warm, and high-legibility** rather than the cold-clinical-blue of typical institutional tools.

---

## Sources

- **Codebase:** `stitch_global_credential_bridge/` (read-only, mounted) — Stitch-generated HTML mocks of every flow screen + a master `compassionate_guidance_system/DESIGN.md` token file. This is the source of truth for color, type, spacing, and component vocabulary.
- **No Figma file** was provided. All design tokens were extracted from the mock HTML and the DESIGN.md frontmatter.

---

## Index

| File / Folder | What's in it |
|---|---|
| `README.md` | This file. High-level context, content fundamentals, visual foundations, iconography. |
| `colors_and_type.css` | All design tokens as CSS custom properties + semantic type classes. |
| `SKILL.md` | Cross-compatible Agent Skill manifest. |
| `assets/` | Logos, generic placeholder imagery, brand SVG decoration. |
| `fonts/` | (Atkinson Hyperlegible Next is loaded from Google Fonts; no local font files needed.) |
| `preview/` | Small HTML cards that populate the Design System tab (one card per concept). |
| `ui_kits/pathfinder/` | The web app UI kit. JSX components + interactive `index.html` click-thru. |

---

## Content Fundamentals

The voice is **empathetic, steadfast, and clarifying**. Pathfinder writes the way a trusted case worker speaks: calm, direct, second-person, never urgent, never patronizing. It assumes the reader is intelligent and stressed, navigating in a second or third language.

**Person & address.** Always second person ("**you**", "**your**"). The product itself is "we" only when explaining what the tool does ("We use this information to customize your pathway"). Never "users", never first-person singular.

**Tone moves.**
- **Affirm before instructing.** Welcome screen leads with *"Your skills travel with you. Let's find your path in the US."* — the reframe ("your skills travel") comes before the action.
- **Name the thing plainly.** Section headers are concrete: *"Tell Us About You"*, *"Your Documents Situation"*, *"Your Time & Money Budget"*, *"Your Career Pathways"*, *"SMART Recertification Plan"*. No marketing words like "Unlock", "Supercharge", "Discover".
- **Justify the ask.** Wherever the form requests data, a soft secondary block explains *why* — *"Why do we need this? Credentialing requirements vary significantly by state and professional background."* This is a fixed pattern, not a one-off.
- **Range over precision when uncertain.** Cost and time are written as `$300 – $800`, `3-6 Months`, `$2,000 (Initial)` — never as a single number unless the source is authoritative.
- **Defer to humans, in writing, by name.** Specialist sidebar reads *"Your case manager, Marcus, is available for a 15-minute check-in call."* Disclaimers read *"Pathfinder provides these comparisons based on current NACES data. However, each credentialing case is unique. We strongly recommend a final review with a Pathfinder advisor before committing…"*

**Casing.**
- Page titles, section headers, card titles: **Title Case** (*Tell Us About You*, *NACES Evaluator Picker*).
- Button labels: **Title Case**, verb-first (*Get Started*, *Continue to Documents*, *Save for Later*, *Talk to a Specialist*).
- Status badges: **Title Case**, single word or two (*High Priority*, *Completed*, *Upcoming*, *Recommended*).
- Eyebrows / category labels above titles: **UPPERCASE with wider tracking** (e.g. *STRATEGY PHASE*, *NACES MEMBER*).
- Inline status pills (confidence): *Confidence: High* — colon, capitalized level.

**Microcopy patterns.**
- "Why do we need this?" — recurring meta-justification block, secondary-container background.
- "Did you know?" — recurring stat callout (always with a real number and source where possible).
- "Need clarification?" / "Need guidance?" — entry into human support.
- "Human Oversight Disclaimer" — used verbatim when the tool is presenting comparisons or recommendations the user might over-trust.

**Emoji.** Never. The vibe is institutional warmth, not cheery. All affordances use Material Symbols Outlined glyphs.

**Numbers and money.** US dollar with `$`, comma thousands, range with en-spaced hyphen: `$300 - $800`, `$2,000`. Time ranges use *Months* / *Years* spelled out: `3-6 Months`, `2 Years`.

**Examples to lift verbatim.**
> Navigate the complex process of foreign credential recognition and professional licensing with a steadfast partner. We help you unlock your professional future.

> Based on your profile, we have identified bridge roles and career steps that honor your medical expertise while fitting within your constraints.

> Your structured roadmap for the next 90 days. We've broken down your medical license recertification into actionable, measurable steps.

---

## Visual Foundations

**Aesthetic direction: Soft Corporate.** The reliability of an institutional tool with the warmth of a wellness app. Minimalism with tonal layering. The page should never feel crowded or rushed — every screen carries generous whitespace and the user should feel they have time.

### Color
- **Anchors:** Terracotta primary `#9c3f12` (active guidance, brand), Forest Green secondary `#39693b` (success, progress, completion), Cream/Parchment `#fff8f1` background, Sand tertiary `#6f5832` for muted accents.
- **Containers** are layered in tonal steps from `--surface-container-lowest` (#ffffff) up through `--surface-container-highest` (#ece1ce). Pure white is reserved for elevated cards on the cream background.
- **Confidence levels** map to a custom semantic scale: High → forest green, Medium → muted sand, Low → soft terracotta. Low is *not* red — red means error, low confidence means "be careful, get a human".
- All text/background pairs hit ≥ 4.5:1 contrast.

### Typography
- **Single family: Atkinson Hyperlegible Next** (originally designed for low-vision readers). Used for absolutely everything — display, headlines, body, labels, buttons.
- **Hierarchy is strict and top-down.** One Display or Headline-LG per view.
- **Body line-height is 1.6** — wider than typical because many users are reading in a second language.
- **Weights: 400 / 600 / 700 / 800.** No thin weights, ever.

### Spacing & Layout
- **8px rhythm.** All gaps are multiples of 8px (`unit`, `stack-sm`, `stack-md`, `stack-lg`, `gutter`).
- **Container max 1120px** on desktop, single-column reflow on mobile.
- **Generous gutters: 24px** (wider than the typical 16px) — visual breathing room is doctrine.
- **Mobile margins 16px, desktop margins 48px.**
- **Bento grid** is the default layout for hero and dashboard screens. Cards of varying spans inside a `gap-6` grid, never edge-to-edge.

### Backgrounds
- **No gradients on full pages.** Backgrounds are flat cream.
- **Hero photography** is used full-bleed inside rounded cards (not edge-to-edge on the page) with a `bg-gradient-to-t from-primary/40 to-transparent` or `from-black/60` protection gradient at the bottom for caption legibility.
- **Imagery vibe:** warm, soft, high-key, naturally-lit. Diverse professionals in bright modern workspaces. Never grayscale, never moody.
- **Decorative SVG blob** in `--inverse-primary` at 10% opacity is occasionally used as an asymmetric anchor in empty corners (top-right of forms). Never above content.

### Elevation & Depth
**Tonal layers > heavy shadows.**
- **Level 0 (page):** `--background` (#fff8f1).
- **Level 1 (cards):** `--surface-container-lowest` (#ffffff) with a 1px border in `--outline-variant` (#ddc0b6).
- **Level 2 (elevated / floating):** Soft, diffused shadow — `0 4px 12px -2px rgba(156,63,18,0.10)` (10% of primary). Lift, not high-contrast edge.
- **Glassmorphism:** Strictly reserved for *Help* / *Support* / contextual sidebars. `rgba(255,255,255,0.7)` + 12px blur. Signals "this exists on a separate plane from the primary task."

### Shape & Radii
- **Always rounded.** Sharp corners are avoided to maintain a soft, non-threatening atmosphere.
- `0.5rem` (8px) — buttons, input fields.
- `0.75rem` – `1rem` (12–16px) — cards.
- `1.5rem` (24px) — large feature blocks / image hero cards.
- `9999px` — pills, status badges, confidence indicators. Pills are reserved for status (not for actionable buttons) so the user can read shape as state.

### Borders
- 1px `--outline-variant` (#ddc0b6) — standard card border.
- 2px `--primary` *bottom* border on input fields (in addition to the standard 1px wrap) — signals "type here", echoes a physical form.
- 2px ring `--primary` on the recommended/active card in a comparison set.

### Animation
- **Easing: ease / ease-out, 150–200ms.** Nothing dramatic.
- **`active:scale-95`** on tappable buttons (subtle press feedback).
- **`hover:scale-[1.02]`** on primary CTA cards (very gentle lift).
- **`group-hover:translate-x-1` 200ms** on inline arrow icons in "Read more" / "Open Portal" links.
- **`group-hover:scale-105` 700ms** on hero photos (slow Ken-Burns nudge).
- **No bounces, no spring physics.** Nothing should feel playful — the user is making a years-long career decision.

### Hover / Press States
- **Hover on cards:** add `shadow-md`, no movement.
- **Hover on links/text buttons:** `hover:bg-surface-container-high` (a tonal step up).
- **Hover on primary button:** `bg-primary-container` (slightly lighter terracotta).
- **Press:** `active:scale-95` everywhere on tappables, `active:scale-98` for nav rows.

### Transparency & Blur
- **Glass blur (12px)** only for help/support panels.
- **Image protection gradients** (40–60% opacity) on photo cards with text.
- **20% backdrop-blur(2px)** on imagery overlay strips (lower-corner caption bars).
- Otherwise, surfaces are opaque.

### Cards
The card is the dominant container. Visual recipe:
- Background: `--surface-container-lowest` (#fff) on cream pages, OR `--surface-container-low` (#fef2de) for nested/secondary cards.
- Border: 1px `--outline-variant` (often at 30% opacity for subtlety).
- Radius: 0.75–1rem.
- Padding: 24px (gutter) standard; 32px on hero cards.
- Shadow: none by default; `shadow-md` on hover or for elevated/recommended state.
- **Recommended state:** swap background to `--primary-container` (terracotta), text to `--on-primary-container` (white), add a 2px ring of `--primary`, and a small uppercase `RECOMMENDED` chip in the corner.
- **Cards never have more than two actions.** This is doctrine — keeps decision-making simple under cognitive load.

### Layout Rules
- TopNavBar: fixed/docked, 80px tall, brand wordmark left, language toggle + avatar right.
- SideNavBar (desktop only ≥ md): 288px wide (`w-72`), 8-step vertical stepper. Active step uses `--secondary-container` background (forest green family).
- BottomNavBar: mobile only (< md). 4 tabs, fixed bottom, rounded top corners, primary-container pill on active.
- Help/Support sidebar: 320px (`w-80`), glassmorphism, hidden < xl.

---

## Iconography

**System: Material Symbols Outlined** (loaded via Google Fonts). This is the only icon system in Pathfinder. It's used consistently across every screen at variation `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24` by default; FILL flips to 1 for active/selected nav items.

**Usage rules:**
- Icons are always paired with a text label (in nav, in stat rows, in stepper). Standalone icon buttons exist only for utility (close, back, expand-more).
- **Color:** primary terracotta on light surfaces; on-primary-container (white) when sitting on terracotta cards; `--secondary` (forest green) for success/check states.
- **Size:** 24px default (Material's `opsz: 24`), 20px in compact stepper rows, 32–40px in feature card headers, 16–18px inline in pill chips.
- **Recurring glyphs:**
  - Brand / journey: `route`
  - Step icons: `person`, `school`, `description`, `verified`, `assignment_turned_in`, `visibility`, `check_circle`
  - Mobile bottom-nav: `map`, `folder_shared`, `support_agent`, `account_circle`
  - Confidence: filled `check_circle`
  - Language toggle: `translate`
  - Specialist / human handoff: `support_agent`, `psychology`
  - Time / calendar: `schedule`, `event`
  - Money / cost: `payments`
  - Speed / urgency: `bolt`, `speed`
  - Nudge / "did you know": `lightbulb`, `info`
  - Profession glyphs (used on bridge-role cards): `medical_services`, `science`, `medication`, `engineering`, `architecture`, `gavel`, `school`, `group_add`

**No emoji. No Unicode glyphs as icons. No hand-rolled SVG icons** — except a single decorative blob shape used as background ornament (kept in `assets/blob.svg`).

**Logo / wordmark.** Pathfinder has no separate logo mark in the source — the wordmark itself ("Pathfinder" set in the Display style, weight 700, terracotta `--primary`, optionally paired with the `route` Material Symbol filled) is the brand mark. Stored as a recipe in `assets/logo.svg` and as a CSS-rendered card in `preview/`.

---

## Substitutions Flagged

- **Atkinson Hyperlegible Next** is loaded from Google Fonts (it ships there). No local font files needed. If the user wants the exact files for offline use, they can download from Google Fonts → Atkinson Hyperlegible Next.
- **Material Symbols Outlined** loaded from Google Fonts CDN.
- **Brand mark** — no separate logomark was provided in the source. We render the wordmark in the Display style as the canonical brand mark. **Flag for the user:** confirm whether a separate symbol/logomark is desired.

---

## Quick Token Reference

```css
/* anchors */
--primary:               #9c3f12;   /* terracotta */
--secondary:             #39693b;   /* forest */
--background:            #fff8f1;   /* cream */
--surface-container-lowest: #ffffff;
--outline-variant:       #ddc0b6;
--on-surface:            #201b0f;
--on-surface-variant:    #56423b;

/* type */
font-family: 'Atkinson Hyperlegible Next';
display: 40/700/-0.02em;  headline-lg: 32/700;  headline-md: 24/600;
body-lg: 18/400/1.6;      body-md: 16/400/1.6;  label-md: 14/600/0.01em;

/* spacing — 8px rhythm */
unit:8  stack-sm:8  stack-md:24  gutter:24  stack-lg:48
```
