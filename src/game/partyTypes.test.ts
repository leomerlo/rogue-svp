import { describe, expect, it } from 'vitest'
import { PARTY_TYPES } from '@/game/partyTypes'

const EXPECTED_IDS = [
  'wedding',
  'funeral',
  'birthday',
  'festival',
  'banquet',
  'engagement',
  'baptism',
  'reunion',
] as const

describe('PARTY_TYPES', () => {
  it('exports all 8 party types with id, label, and oneLiner', () => {
    expect(PARTY_TYPES).toHaveLength(8)
    for (const party of PARTY_TYPES) {
      expect(party.id).toBeTruthy()
      expect(party.label).toBeTruthy()
      expect(party.oneLiner).toBeTruthy()
    }
    expect(PARTY_TYPES.map((p) => p.id)).toEqual([...EXPECTED_IDS])
  })

  it('includes [CHAR.name] in every one-liner template', () => {
    for (const party of PARTY_TYPES) {
      expect(party.oneLiner).toContain('[CHAR.name]')
    }
  })
})
