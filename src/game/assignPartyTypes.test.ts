import { describe, expect, it } from 'vitest'
import { assignPartyTypes } from '@/game/assignPartyTypes'
import { PARTY_TYPES } from '@/game/partyTypes'
import { seededRandom } from '@/game/seededRandom'

describe('assignPartyTypes', () => {
  it('returns exactly 4 distinct party types from PARTY_TYPES', () => {
    const assigned = assignPartyTypes(seededRandom(42))
    expect(assigned).toHaveLength(4)
    const ids = assigned.map((p) => p.id)
    expect(new Set(ids).size).toBe(4)
    for (const party of assigned) {
      expect(PARTY_TYPES.some((p) => p.id === party.id)).toBe(true)
    }
  })

  it('is deterministic for the same RNG state', () => {
    const rngA = seededRandom(99)
    const rngB = seededRandom(99)
    expect(assignPartyTypes(rngA).map((p) => p.id)).toEqual(
      assignPartyTypes(rngB).map((p) => p.id),
    )
  })

  it('can produce different assignments for different seeds', () => {
    const a = assignPartyTypes(seededRandom(1)).map((p) => p.id).join(',')
    const b = assignPartyTypes(seededRandom(2)).map((p) => p.id).join(',')
    expect(a).not.toBe(b)
  })

  it('attaches a oneLiner string drawn from the party type oneLiners', () => {
    const assigned = assignPartyTypes(seededRandom(42))
    for (const party of assigned) {
      expect(typeof party.oneLiner).toBe('string')
      expect(party.oneLiner.length).toBeGreaterThan(0)
      const source = PARTY_TYPES.find((p) => p.id === party.id)!
      expect(source.oneLiners).toContain(party.oneLiner)
    }
  })

  it('oneLiner selection is deterministic for the same seed', () => {
    const rngA = seededRandom(7)
    const rngB = seededRandom(7)
    const linesA = assignPartyTypes(rngA).map((p) => p.oneLiner)
    const linesB = assignPartyTypes(rngB).map((p) => p.oneLiner)
    expect(linesA).toEqual(linesB)
  })

  it('can select different oneLiners for different seeds', () => {
    const allSame = Array.from({ length: 20 }, (_, i) =>
      assignPartyTypes(seededRandom(i)).map((p) => p.oneLiner).join('|'),
    )
    const unique = new Set(allSame)
    expect(unique.size).toBeGreaterThan(1)
  })
})
