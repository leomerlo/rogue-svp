# Authored deck replaces procedural deck generation

A single fixed 67-card deck replaces per-level procedural deck generation (inverse construction). The deck is the same set used in the original RSVP board game.

## Context

ADR-0018 replaced procedural topology generation with 12 authored topologies on a fixed 6×3 grid. The inverse construction deck generator (`generateDeck`) was left intact, producing a different deck each run by solving the topology first and deriving cards from that solution.

Two motivations prompted a parallel change to deck authoring:

1. **Fidelity to the original game.** The original RSVP deck is a specific 67-card set with known color combinations and point values. Replicating it exactly preserves the feel and balance the game was designed around.
2. **Authored consistency.** With topologies now fixed, having procedurally varying decks is the last source of solvability risk. Authoring the deck closes that risk while making the card pool familiar to returning players.

## Decision

- A single authored deck of **67 cards** is defined in `authoredDeck.ts` as an `AUTHORED_DECK: Card[]` constant. The card set matches the original RSVP game.
- **The deck resets at the start of every level** — all 67 cards are available for each topology. No cross-level card depletion.
- **The deck is shuffled on reset** using the existing seeded-random infrastructure (`shuffled()` + run seed). The card set is fixed; the draw order varies per run.
- **Solvability is pre-verified**, not runtime-checked. A test in `authoredDeck.test.ts` asserts `solutionCount ≥ 1` for each of the 12 authored topologies against `AUTHORED_DECK`. This test runs in CI; it fails loudly if either the deck or a topology is edited in a way that breaks solvability.
- **`generateDeck` and inverse construction become dead code.** They are removed — not kept as a fallback. The authored deck is the only deck path.
- **Card values** (`0 / 5 / 10 / 15 / 20 / 25`) are present on the authored data but not part of the `Card` type yet — they are reserved for the scoring system (§2.5 of CONTEXT.md) and added to the type when that system is implemented.
- Wild cards in the authored data are represented as `[w, x]` (notation: `x` = irrelevant second slot). These map to `{ colorA: 'wild', colorB: 'wild' }` in the type system; `x` never enters the codebase.

## Considered alternatives

- *Per-topology authored deck* — each topology gets its own 67-card deck. Rejected: unnecessary duplication; the same card pool works across all topologies once pre-verified.
- *Shared pool with cross-level depletion* — cards consumed in one level are unavailable in the next (roguelike deck-building). Rejected: much larger design change, complicates save/restore and redeals, deferred to future consideration.
- *Keep `generateDeck` as fallback* — retain inverse construction for hypothetical future topologies. Rejected: speculative complexity; the clean break matches the precedent set by ADR-0018 for topologies.

## Consequences

- `authoredDeck.ts` defines `AUTHORED_DECK: Card[]`.
- `authoredDeck.test.ts` verifies solvability for all 12 topologies.
- `deck.ts`, `generateDeck`, `buildSolutionCards`, and related inverse-construction code are removed.
- `DeckParams`, `DeckDef`, `bufferSize`, `wildCount` fields on `TopologyDef` (ADR-0018) become unused and are removed from `types.ts`.
- `generateMesa.ts` deck-generation call is replaced by `shuffled(AUTHORED_DECK, rng)`.
- The `wildRatio` field on `DeckDef` (currently unused) is removed along with `DeckDef`.
