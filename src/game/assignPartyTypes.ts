import { PARTY_TYPES, type PartyType } from '@/game/partyTypes'
import { shuffled, type SeededRandom } from '@/game/seededRandom'

const MESA_PARTY_COUNT = 4

function assignPartyTypes(rng: SeededRandom): PartyType[] {
  return shuffled(PARTY_TYPES, rng).slice(0, MESA_PARTY_COUNT)
}

export { assignPartyTypes, MESA_PARTY_COUNT }
