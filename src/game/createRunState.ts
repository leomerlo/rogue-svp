import type { NarrativeState, NarrativeTag, RunState } from '@/game/types'
import { ARCHETYPES } from '@/game/archetypes'
import { assignPartyTypes } from '@/game/assignPartyTypes'
import { generateFullName } from '@/game/nameGenerator'
import { hashStringToSeed, seededRandom } from '@/game/seededRandom'

const ROSTER_SIZE = 4

function createNarrativeState(rng: () => number): NarrativeState {
  const roster = Array.from({ length: ROSTER_SIZE }, () => {
    const { firstName, familyName } = generateFullName(rng)
    return {
      name: `${firstName} ${familyName}`,
      archetypeId: ARCHETYPES[Math.floor(rng() * ARCHETYPES.length)]!.id,
      tags: [] as NarrativeTag[],
    }
  })
  return { roster }
}

function createRunState(seed: string): RunState {
  const rng = seededRandom(hashStringToSeed(seed))
  const partyTypes = assignPartyTypes(rng)
  const partyAssignments = partyTypes.map((pt) => {
    const { firstName, familyName } = generateFullName(rng)
    const archetype = ARCHETYPES[Math.floor(rng() * ARCHETYPES.length)]!
    return {
      partyTypeId: pt.id,
      characterName: `${firstName} ${familyName}`,
      familyName,
      archetypeId: archetype.id,
      oneLiner: pt.oneLiner,
    }
  })
  const narrativeState = createNarrativeState(rng)
  return {
    topologyIndex: 0,
    relicsActive: [],
    scoreTotal: 0,
    seed,
    status: 'splash',
    pendingMesaScore: 0,
    partyAssignments,
    narrativeState,
  }
}

export { createRunState }
