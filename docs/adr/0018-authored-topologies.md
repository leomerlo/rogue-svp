# Authored topologies replace procedural topology generation

Topology selection switches from generate-and-test (random blocked-cell placement calibrated via metric bands) to a curated set of 12 authored `TopologyDef` objects, each with fixed blocked-cell patterns and per-topology deck params.

## Context

The procedural topology generator in `generateMesa.ts` built difficulty by increasing blocked cells (lower `avgSeatDegree`, more `bottleneckCount`). Playtesting revealed this is backwards: boards felt random and unfun. The original RSVP insight is that **denser boards are harder** — more free seats means more edges per card to satisfy simultaneously. Champagne Brunch, the hardest original level, has only 2 blocked cells on a 6×3 grid. The metric-band system (ADR-0017) encoded the wrong design principle for topology.

A second problem: random blocked-cell placement produces boards with no visual or mechanical personality. The original game's levels each have a distinct shape that communicates the puzzle's character before play begins.

## Decision

- **12 authored topologies** on a **fixed 6×3 grid** replace all procedural topology generation.
- Topologies are sequenced **fixed per run** (4 per act, 3 acts). No random topology selection.
- Each `TopologyDef` carries `deckParams: { wildCount, bufferSize }` instead of referencing difficulty bands.
- **Deck generation is unchanged**: inverse construction (solve first, derive deck) remains the solvability strategy. Procedural variation between runs comes entirely from deck generation over a fixed topology.
- **Pinned seat positions remain procedural** (ADR-0016 unchanged).
- The difficulty-band metric system (ADR-0017) is superseded for topology selection. Metrics may be retained for diagnostic tooling only.

## Topology authoring principle

Harder topologies have **more free seats** (higher average degree), not fewer. Difficulty comes from the shape and position of blocked cells — the intentional constraints they create — not their count.

## Consequences

- `generateMesa.ts` topology-generation logic (`generateTopology`, `ATTEMPT_CONFIGS`, the attempt loop) is removed or replaced by a topology lookup.
- `difficultyBands.ts` and `mesaMetrics.ts` are no longer part of the generation pipeline; they can be deleted or kept as diagnostics.
- A new `topologies.ts` file defines the 12 authored `TopologyDef` objects with their `deckParams`.
- `types.ts` gains `deckParams` on `TopologyDef` (or alongside it in the new data structure).
- The run structure consumes topologies by index (0–11) from the ordered array.
