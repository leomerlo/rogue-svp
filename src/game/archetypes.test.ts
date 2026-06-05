import { describe, expect, it } from 'vitest'
import { ARCHETYPES } from '@/game/archetypes'
import { createRunState } from '@/game/createRunState'

describe('ARCHETYPES', () => {
  it('has at least 8 entries', () => {
    expect(ARCHETYPES.length).toBeGreaterThanOrEqual(8)
  })

  it('every entry has required fields', () => {
    for (const archetype of ARCHETYPES) {
      expect(archetype.id).toBeTruthy()
      expect(archetype.label).toBeTruthy()
      expect(archetype.socialPosture).toBeTruthy()
      expect(archetype.comicWeakness).toBeTruthy()
    }
  })

  it('all ids are unique', () => {
    const ids = ARCHETYPES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('archetype assignment in createRunState', () => {
  it('each party assignment includes a valid archetypeId', () => {
    const validIds = new Set(ARCHETYPES.map((a) => a.id))
    const state = createRunState('test-seed')
    for (const assignment of state.partyAssignments) {
      expect(validIds.has(assignment.archetypeId)).toBe(true)
    }
  })

  it('each party assignment includes a non-empty familyName', () => {
    const state = createRunState('test-seed')
    for (const assignment of state.partyAssignments) {
      expect(assignment.familyName).toBeTruthy()
    }
  })

  it('characterName contains the familyName', () => {
    const state = createRunState('test-seed')
    for (const assignment of state.partyAssignments) {
      expect(assignment.characterName).toContain(assignment.familyName)
    }
  })

  it('archetype assignments are deterministic for the same seed', () => {
    const a = createRunState('determinism-seed')
    const b = createRunState('determinism-seed')
    expect(a.partyAssignments.map((p) => p.archetypeId)).toEqual(
      b.partyAssignments.map((p) => p.archetypeId),
    )
  })

  it('archetype assignments differ for different seeds', () => {
    const attempts = Array.from({ length: 10 }, (_, i) => createRunState(`seed-${i}`))
    const archetypeSets = attempts.map((s) => s.partyAssignments.map((p) => p.archetypeId).join(','))
    const unique = new Set(archetypeSets)
    expect(unique.size).toBeGreaterThan(1)
  })
})
