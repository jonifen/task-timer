# Task Timer

## Overview
A progressive web app for tracking tasks with multiple timers that can be started, paused and completed, with times stored in the IndexedDB of the browser.

**Stack:** TypeScript, React 19, Vanilla Extract CSS, React Router DOM v7, Zustand v5, Vite 7, Vitest, React Testing Library, localforage

## Commands
- `npm install` - install dependencies (use `--legacy-peer-deps` if peer dep conflicts arise, e.g. `eslint-plugin-react` with eslint v10)
- `npm run dev` - start dev server (port 3008)
- `npm test` - run tests
- `npm run lint` - run ESLint

## Code Style
- Prefer async/await over promise `.then()` chains
- Prefer named exports over default exports
- Only use `const`/`let`, never `var`
- Extract reusable UI-tied logic into custom hooks (e.g. `use-timer.ts`)
- Extract non-UI business logic into utility functions
- Keep logic in the component itself only if it is not reusable
- Types and interfaces are defined close to where they are used, not in a centralised `src/types/` directory
- Check before installing new dependencies

## File Naming
- All files use kebab-case (e.g. `task-timer.tsx`, `use-timer.ts`)
- Component files use `.tsx`, utility and hook files use `.ts`
- Test files are co-located with source files (e.g. `task-timer.test.tsx` sits alongside `task-timer.tsx`)
- Style files are co-located with their component (e.g. `task-timer.css.ts` alongside `task-timer.tsx`)

## Formatting
Uses Prettier with the following preferences:
- Double quotes (not single quotes)
- Line length: 120 characters

## Architecture
- `src/routes.tsx` - Component that sets up the routes used by React Router DOM
- `src/pages/` - Page components to align with routes defined
- `src/components/` - All smaller components
- `src/hooks/` - Shared custom hooks (created as needed)
- `src/utils/` - Shared utility functions (created as needed)
- `src/db/` - IndexedDB interaction layer using `localforage` under the hood. All IndexedDB access goes through here — no other files should import `localforage` directly

## Pages & Routes
- `/` - Home/landing page explaining how to use the app
- `/timers` - List of reusable timers; create and manage timer configurations. Includes a "Quick timer" button that starts an unnamed timer immediately (no config created) and prompts the user to name it inline. Saves to history only.
- `/history/:yyyy/:mm/:dd` - Daily view showing active and completed timers for a given date. Defaults to today but supports navigating to historic dates

On first visit, the app stays on `/`. Returning users are redirected to today's history page. This is handled by `InitialRedirect` in `src/routes.tsx` using a `localStorage.hasVisited` flag.

## State Management
Uses Zustand for global state. The store holds:
- The list of reusable timer configurations
- The active/completed timer history for the currently viewed date only

When the user navigates to a different date on the history page:
1. The new date's data is loaded from IndexedDB into the Zustand store
2. The page path updates to reflect the new date (e.g. `/history/2026/03/05`)

**Persistence pattern:** Every timer action (start, resume, pause, complete, stop-all) saves the full `timerEntries` array to IndexedDB immediately after updating the store. `navigateToDate` is load-only — it never saves. This avoids the bug where navigating overwrites real data with the store's empty initial state on page refresh.

**Single-timer rule:** Only one timer can be active at a time. `startTimerEntry` and `resumeTimerEntry` both pause any currently active timer atomically in the same `set()` call.

**Quick timer entries:** `TimerEntry.configId` is optional. Quick timers have no `configId` and are managed directly by entry ID, bypassing `useTimer` (which is config-based).

## Styling
Uses Vanilla Extract for styling:
- Light and dark themes using Vanilla Extract's `createTheme` API
- Styles are co-located with their component in a `.css.ts` file (e.g. `task-timer.css.ts` alongside `task-timer.tsx`)
- Avoid sprinkles or recipes for now — keep styling simple

