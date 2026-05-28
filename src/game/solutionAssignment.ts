import type { Card, RegularColor, TopologyDef } from '@/game/types'
import { cellKey } from '@/game/helpers'
import { seededRandom, shuffled } from '@/game/seededRandom'

const REGULAR_COLORS: RegularColor[] = ['red', 'blue', 'green', 'yellow']

type Seat = { row: number; col: number }

type Assignment = { colorA: RegularColor; colorB: RegularColor }

function freeSeats(topology: TopologyDef): Seat[] {
  return topology.cells
    .filter((c) => c.state === 'free')
    .sort((a, b) => a.row - b.row || a.col - b.col)
}

function neighborSeats(topology: TopologyDef, seat: Seat, freeSet?: Set<string>): Seat[] {
  const deltas = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ] as const

  const set =
    freeSet ??
    new Set(topology.cells.filter((c) => c.state === 'free').map((c) => cellKey(c.row, c.col)))

  const neighbors: Seat[] = []
  for (const { dr, dc } of deltas) {
    const row = seat.row + dr
    const col = seat.col + dc
    if (row < 0 || row >= topology.rows || col < 0 || col >= topology.cols) continue
    if (!set.has(cellKey(row, col))) continue
    neighbors.push({ row, col })
  }
  return neighbors
}

function satisfiesConstraints(
  topology: TopologyDef,
  assignment: Map<string, Assignment>,
  seat: Seat,
  colorA: RegularColor,
  colorB: RegularColor,
  freeSet: Set<string>,
): boolean {
  for (const neighbor of neighborSeats(topology, seat, freeSet)) {
    const nAssign = assignment.get(cellKey(neighbor.row, neighbor.col))
    if (nAssign === undefined) continue

    const dr = neighbor.row - seat.row
    const dc = neighbor.col - seat.col

    if (dr === 0 && dc === 1) {
      if (colorB !== nAssign.colorA) return false
    } else if (dr === 0 && dc === -1) {
      if (colorA !== nAssign.colorB) return false
    } else if (dr === 1 && dc === 0) {
      if (colorB !== nAssign.colorA) return false
    } else if (dr === -1 && dc === 0) {
      if (colorA !== nAssign.colorB) return false
    }
  }

  return true
}

function allColorPairs(rng: () => number): Array<{ colorA: RegularColor; colorB: RegularColor }> {
  const pairs: Array<{ colorA: RegularColor; colorB: RegularColor }> = []
  for (const colorA of REGULAR_COLORS) {
    for (const colorB of REGULAR_COLORS) {
      pairs.push({ colorA, colorB })
    }
  }
  return shuffled(pairs, rng)
}

function buildSolutionAssignmentInternal(
  seats: Seat[],
  freeSet: Set<string>,
  topology: TopologyDef,
  seed: number,
): Map<string, Assignment> | null {
  const assignment = new Map<string, Assignment>()
  const rng = seededRandom(seed)

  function backtrack(index: number): boolean {
    if (index >= seats.length) return true

    const seat = seats[index]!
    const pairs = allColorPairs(rng)

    for (const { colorA, colorB } of pairs) {
      if (!satisfiesConstraints(topology, assignment, seat, colorA, colorB, freeSet)) continue

      const key = cellKey(seat.row, seat.col)
      assignment.set(key, { colorA, colorB })

      if (backtrack(index + 1)) return true

      assignment.delete(key)
    }

    return false
  }

  if (!backtrack(0)) return null
  return assignment
}

function buildSolutionAssignment(
  topology: TopologyDef,
  seed: number,
): Map<string, Assignment> | null {
  const seats = freeSeats(topology)
  const freeSet = new Set(seats.map((s) => cellKey(s.row, s.col)))
  return buildSolutionAssignmentInternal(seats, freeSet, topology, seed)
}

function buildSolutionCards(topology: TopologyDef, seed: number): Card[] {
  const seats = freeSeats(topology)
  const freeSet = new Set(seats.map((s) => cellKey(s.row, s.col)))
  const maxAttempts = 32

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const assignment = buildSolutionAssignmentInternal(seats, freeSet, topology, seed + attempt)
    if (assignment === null) continue

    return seats.map((seat, index) => {
      const { colorA, colorB } = assignment.get(cellKey(seat.row, seat.col))!
      return {
        id: `gen-${seed}-${index}`,
        colorA,
        colorB,
      }
    })
  }

  throw new Error(`Failed to build solution assignment for topology (seed=${seed})`)
}

export {
  REGULAR_COLORS,
  freeSeats,
  neighborSeats,
  buildSolutionAssignment,
  buildSolutionCards,
  cellKey as seatKey,
}
