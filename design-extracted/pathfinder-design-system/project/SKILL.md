---
name: pathfinder-design
description: Use this skill to generate well-branded interfaces and assets for Pathfinder, a credential-translation tool for immigrants and refugees, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (`colors_and_type.css` for tokens; `assets/` for logo + decoration; `preview/` for cards demonstrating each foundation; `ui_kits/pathfinder/` for the React component recreation of the credentialing flow).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. The fastest way to start: copy `colors_and_type.css` and link it; then lift component patterns from `ui_kits/pathfinder/` (Chrome.jsx, Form.jsx, Cards.jsx, Tasks.jsx) and the matching styles in `kit.css`.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. The non-negotiables: (1) Atkinson Hyperlegible Next as the only typeface, (2) Material Symbols Outlined as the only icon system, (3) terracotta `#9c3f12` primary and forest-green `#39693b` secondary on a cream `#fff8f1` background, (4) 8px spacing rhythm, (5) confidence levels as a labeled tri-state (High forest / Medium sand / Low terracotta — *not* red), (6) every AI-generated mapping ships with a one-click handoff to a human / NACES evaluator, (7) cost and time always presented as ranges with stated assumptions, never single numbers, (8) tonal layering over heavy shadows, (9) glassmorphism only for help/support sidebars.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, screen vs print, language coverage, depth of human-handoff cues), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
