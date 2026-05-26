# RogueSVP

MVP web app for the RSVP roguelike puzzle game. See [MVP.md](./MVP.md) and [Context.md](./Context.md) for design context.

## Prerequisites

- Node.js 20+

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run lint` | Run ESLint |

## Project layout

- `src/game/` — pure TypeScript game logic (no React)
- `src/ui/` — React components
