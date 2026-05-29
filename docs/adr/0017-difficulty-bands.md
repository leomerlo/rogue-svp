# Difficulty bands: four metrics, five targets, generate-and-test acceptance

`generateMesa(difficultyTarget, params)` produces a topology + deck whose computed metrics fall within a target band. Context.md §3.3 lists four calibration metrics; this ADR defines how they are measured, what each difficulty level expects, and how candidates are accepted or rejected.

**Numeric thresholds live in `src/game/difficultyBands.ts`.** This ADR records intent; retune constants without amending the ADR when calibration tests stay green.

## Metrics

| Metric | Definition | Harder when |
|--------|------------|-------------|
| `solutionCount` | Number of valid full-seat arrangements assignable from the deck | Lower |
| `wildRatio` | `wildCount / deckSize` | Lower |
| `bottleneckCount` | Free seats with exactly one free orthogonal neighbor (degree-1 nodes) | Higher |
| `avgSeatDegree` | Mean free-neighbor count across free seats | Lower |

**Capped solution counting:** arrangement counting stops at `maxCount` (default 100). When capped, band matching treats `solutionCount` as ≥ `maxCount` so easy bands with high minimums still accept very open puzzles.

**Wild count per target:** the generator sets `wildCount` from difficulty — easy targets prefer 2 wilds, mid 1, hard 0 — so `wildRatio` varies independently of topology.

## Difficulty bands (levels 1–5)

Inclusive ranges; all four metrics must pass.

| Level | solutionCount | wildRatio | bottlenecks | avgSeatDegree |
|-------|---------------|-----------|-------------|---------------|
| 1 | ≥ 20 (capped ok) | ≥ 0.055 | 0–1 | ≥ 2.4 |
| 2 | ≥ 8 (capped ok) | ≥ 0.04 | 0–2 | ≥ 2.2 |
| 3 | 3–15 | 0–0.07 | 1–3 | 2.0–2.5 |
| 4 | 2–6 | 0–0.05 | 2–4 | 1.8–2.3 |
| 5 | 1–2 | ≤ 0.035 | ≥ 3 | ≤ 2.1 |

Calibrated on the default 4×4 grid (`rows: 4, cols: 4`, ~60% free seats).

## Acceptance strategy

1. **Generate-and-test:** for each attempt, build topology + deck (inverse construction guarantees ≥1 solution), compute metrics, accept if in band.
2. **Attempt budget:** configurable (`attemptBudget`, default 80). Seeds advance per attempt for deterministic search.
3. **Fallback:** when the budget is exhausted, return the candidate with the lowest L1 distance to the band midpoint. Never throws; output is always a solvable mesa.

## Considered alternatives

- *Single composite difficulty score* — rejected: opaque, hard to tune, loses interpretability per metric.
- *Uncapped solution counting* — rejected: exponential cost on larger grids; cap is sufficient for band discrimination.
- *Throw on fallback* — rejected: breaks deterministic pipeline; closest-match keeps generation alive.

## Consequences

- `difficultyBands.ts` constants must match this table.
- Calibration tests (100 generations per level) guard band drift.
- UI / `createGeneratedGameState` integration is deferred; consumers call `generateMesa` directly.
