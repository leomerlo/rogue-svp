import { PARTY_TYPES, type PartyType } from '@/game/partyTypes'
import { shuffled, type SeededRandom } from '@/game/seededRandom'

interface AssignedPartyType extends PartyType {
  oneLiner: string
}

const MESA_PARTY_COUNT = 4

function assignPartyTypes(rng: SeededRandom): AssignedPartyType[] {
  // RNG budget: (PARTY_TYPES.length - 1) draws for Fisher-Yates shuffle + MESA_PARTY_COUNT draws for one-liner selection.
  return shuffled(PARTY_TYPES, rng).slice(0, MESA_PARTY_COUNT).map((pt) => {
    const index = Math.floor(rng() * pt.oneLiners.length)
    return { ...pt, oneLiner: pt.oneLiners[index]! }
  })
}

export { assignPartyTypes, MESA_PARTY_COUNT }
export type { AssignedPartyType }
