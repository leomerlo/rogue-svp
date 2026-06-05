import { ARCHETYPES } from '@/game/types'
import type { NarrativeState, NarrativeTag, RunState } from '@/game/types'
import { assignPartyTypes } from '@/game/assignPartyTypes'
import { generateName } from '@/game/nameGenerator'
import { hashStringToSeed, seededRandom } from '@/game/seededRandom'

const ROSTER_SIZE = 4

function createNarrativeState(rng: () => number): NarrativeState {
  const roster = Array.from({ length: ROSTER_SIZE }, () => ({
    name: generateName(rng),
    archetype: ARCHETYPES[Math.floor(rng() * ARCHETYPES.length)]!,
    tags: [] as NarrativeTag[],
  }))
  return { roster }
}

function createRunState(seed: string): RunState {
  const rng = seededRandom(hashStringToSeed(seed))
  const partyTypes = assignPartyTypes(rng)
  const partyAssignments = partyTypes.map((pt) => ({
    partyTypeId: pt.id,
    characterName: generateName(rng),
  }))
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
