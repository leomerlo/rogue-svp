# Pinned seats: pre-filled immovable anchors via solver-first promotion

A "pinned seat" (`CellState: 'pinned'`) is a free seat that starts the puzzle with a card already placed — the player cannot move or swap it. It acts as a constraint anchor the rest of the seating must build around.

The two colors of a pinned seat come from its card (same `colorA`/`colorB` model as player cards) — no separate `fixedColor` field is needed. The original `fixedColor: Color | null` stub on `Cell` is removed.

**How pinned cards are generated:** the constraint solver runs over all free seats first and produces a complete valid assignment. A random subset of those solved cells is then promoted to pinned — their cards are moved to `placedCards` at game start and removed from the shuffled deck. Solvability is guaranteed by construction because the promoted cells were already part of a valid solution. The count is controlled by a `pinnedCount` parameter (default 0).

**Considered alternatives:**
- *Topology carries colors* — `TopologyDef` would store fixedColorA/B for pinned cells, forcing the generator to assign colors before solving the rest. Rejected: couples color data to the shape layer; requires the solver to treat those cells as external constraints rather than just promoting solved ones.
- *Designer-authored only* — pinned cells specified per scenario, never procedurally. Rejected: defers the feature entirely; procedural pinning is useful for M2 difficulty tuning.

**Consequences:**
- `isSolved` must check pinned cells for happiness (not just free cells) — change the guard from `cell.state !== 'free'` to `cell.state === 'blocked'`.
- `movement.ts` swap guards must reject pinned cells alongside blocked cells.
- `neighborsOf` requires no change — it already includes all non-blocked cells as neighbors.
