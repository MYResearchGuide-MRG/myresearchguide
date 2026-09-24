# Handoff: Interactive Organisation Team Page

## Repository Identity

- Repository: `/Users/moses/orca/mrgmainwebsite`
- Branch: `codex/initial-website`
- HEAD at handoff: `190db42`
- Remote: `https://github.com/moseslua/mrg-main-website.git`
- Route: `http://localhost:3000/team`

## Caller Goal

Refactor the team section and the content below the Board of Advisors area into a polished, dark, responsive organisation page. The page should present executive leadership, department directors, departments, members, multi-department affiliations, advisor profiles, progressive disclosure, and accessible profile interactions.

## Completed Artifacts

- `/Users/moses/orca/mrgmainwebsite/src/app/team/organisation-data.js`
  - Canonical person-centric roster.
  - Department mappings and director ownership.
  - One record each for multi-department people such as Jocelyn Gresia and Pau Chen You.
  - Separate advisor roster with valid local portraits and available LinkedIn links.
- `/Users/moses/orca/mrgmainwebsite/src/app/team/organisation-graph.jsx`
  - Desktop hierarchy graph.
  - Mobile stacked accordion.
  - Department selection, replacement, collapse, and outside-click behavior.
  - Profile side drawer on desktop and bottom sheet on mobile.
  - Escape handling, focus restoration, focus trapping, semantic buttons, and avatar initials fallback.
- `/Users/moses/orca/mrgmainwebsite/src/app/team/organisation.module.css`
  - Scoped dark visual system.
  - Leadership, director, department, active-state, drawer, responsive, and reduced-motion styles.
- `/Users/moses/orca/mrgmainwebsite/src/app/team/committees.jsx`
  - Reduced to the route-compatible wrapper for the new organisation graph.
- `/Users/moses/orca/mrgmainwebsite/src/app/team/page.jsx`
  - Removed the unused background/advisor imports and retained the existing page shell.
- Removed unreachable `/Users/moses/orca/mrgmainwebsite/src/app/team/advisors.jsx`, which contained duplicate local state and invalid placeholder image URLs.

## Verification Evidence

- `npm run build`: passed; `/team` generated successfully.
- Targeted ESLint for the changed team files: passed.
- `npx tsc --noEmit`: passed; the production build also completed its TypeScript phase.
- `git diff --check`: passed.
- HTTP smoke check: `GET /team` returned `200`.
- Playwright fallback was used because Browser/IAB and a local browser binary were unavailable.
- Desktop and mobile screenshots were captured and inspected at `1280px` and `320px`:
  - `/tmp/mrg-organisation-desktop.png`
  - `/tmp/mrg-organisation-mobile.png`
  - `/tmp/mrg-profile-viewport-desktop.png`
  - `/tmp/mrg-team-final.png`
- Live interaction checks passed:
  - Tech expansion opened.
  - Tech replaced by Media without stacking panels.
  - Mobile department accordion opened with keyboard `Enter`.
  - Profile drawer opened, focused its close control, and closed with `Escape`.
  - Outside click collapsed the active department.
  - No horizontal overflow at desktop or `320px` mobile width.
  - No duplicate IDs, missing `aria-controls` targets, or browser runtime errors.
  - Reduced-motion context reported `animationName: none` for the expansion panel.

## Unresolved Facts and Risks

- Repository-wide `npm run lint` still reports four pre-existing errors in shared files: `src/components/ui/background-paths.tsx`, `src/components/ui/bento-grid.tsx`, `src/components/ui/card-21.tsx`, and `src/components/ui/gradient-text.tsx`. None were changed for this handoff.
- The existing about/mission/header shell above the organisation section was retained; this handoff covers the refactored organisation surface and the advisor section below it.
- The worktree already contained unrelated modified/generated files, including `package-lock.json`, `.next/`, `node_modules/`, `.od-skills/`, `next-env.d.ts`, and `Full Logo_coloured_2026.png`. They were preserved.
- No commit or GitHub push was performed.

## Continuation Text

No caller-supplied continuation text was provided.
