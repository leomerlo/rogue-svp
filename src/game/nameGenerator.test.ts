import { describe, expect, it } from 'vitest'
import { assignPartyTypes } from '@/game/assignPartyTypes'
import { generateFullName, generateName, parseCharacterName } from '@/game/nameGenerator'
import { hashStringToSeed, seededRandom } from '@/game/seededRandom'

function bootstrapRunGeneration(seed: string) {
  const rng = seededRandom(hashStringToSeed(seed))
  const partyTypes = assignPartyTypes(rng)
  const names = [generateName(rng), generateName(rng), generateName(rng), generateName(rng)]
  return { partyTypes, names }
}

describe('generateFullName', () => {
  it('returns firstName and familyName as separate strings', () => {
    const { firstName, familyName } = generateFullName(seededRandom(42))
    expect(firstName).toBeTruthy()
    expect(familyName).toBeTruthy()
  })

  it('is deterministic for the same RNG state', () => {
    const rngA = seededRandom(42)
    const rngB = seededRandom(42)
    expect(generateFullName(rngA)).toEqual(generateFullName(rngB))
  })

  it('familyName appears in generateName output', () => {
    const rng = seededRandom(99)
    const { familyName } = generateFullName(seededRandom(99))
    expect(generateName(rng)).toContain(familyName)
  })
})

describe('generateName', () => {
  it('returns a two-part full name', () => {
    const name = generateName(seededRandom(42))
    const parts = name.split(' ')
    expect(parts).toHaveLength(2)
    expect(parts[0]).toBeTruthy()
    expect(parts[1]).toBeTruthy()
  })

  it('is deterministic for the same RNG state', () => {
    const rngA = seededRandom(42)
    const rngB = seededRandom(42)
    expect(generateName(rngA)).toBe(generateName(rngB))
    expect(generateName(rngA)).toBe(generateName(rngB))
  })

  it('can produce different names for different seeds', () => {
    const a = generateName(seededRandom(1))
    const b = generateName(seededRandom(2))
    expect(a).not.toBe(b)
  })

  it('produces the same party types and names for the same run seed', () => {
    const first = bootstrapRunGeneration('run-seed')
    const second = bootstrapRunGeneration('run-seed')
    expect(second.partyTypes.map((p) => p.id)).toEqual(first.partyTypes.map((p) => p.id))
    expect(second.names).toEqual(first.names)
  })
})

describe('parseCharacterName', () => {
  it('splits "FirstName FamilyName" correctly', () => {
    expect(parseCharacterName('Elena García')).toEqual({ name: 'Elena', family: 'García' })
  })

  it('handles a name with no space', () => {
    expect(parseCharacterName('Mononombre')).toEqual({ name: 'Mononombre', family: '' })
  })

  it('handles empty string', () => {
    expect(parseCharacterName('')).toEqual({ name: '', family: '' })
  })

  it('handles multi-word family name', () => {
    expect(parseCharacterName('Ana De La Cruz')).toEqual({ name: 'Ana', family: 'De La Cruz' })
  })
})
