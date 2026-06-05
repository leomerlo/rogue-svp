import type { RunState } from '@/game/types'
import { assignPartyTypes } from '@/game/assignPartyTypes'
import { generateName } from '@/game/nameGenerator'
import { hashStringToSeed, seededRandom } from '@/game/seededRandom'

function createRunState(seed: string): RunState {
  const rng = seededRandom(hashStringToSeed(seed))
  const partyTypes = assignPartyTypes(rng)
  const partyAssignments = partyTypes.map((pt) => ({
    partyTypeId: pt.id,
    characterName: generateName(rng),
  }))
  return {
    topologyIndex: 0,
    relicsActive: [],
    scoreTotal: 0,
    seed,
    status: 'splash',
    pendingMesaScore: 0,
    partyAssignments,
  }
}

export { createRunState }
