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
})
