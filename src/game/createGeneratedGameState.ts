import type { GameState } from '@/game/types'
import { shuffleAuthoredDeck } from '@/game/authoredDeck'
import { createGameStateFromMesa } from '@/game/createGameStateFromMesa'
import { getTopology } from '@/game/topologies'

type GeneratedGameOptions = {
  seed?: number
}

function createGeneratedGameState(
  topologyIndex: number,
  options: GeneratedGameOptions = {},
): GameState {
  const topology = getTopology(topologyIndex)
  const seed = options.seed ?? 0
  const deckCards = shuffleAuthoredDeck(seed)

  const state = createGameStateFromMesa(topology, deckCards, {
    deckSeed: seed,
  })

  return { ...state, topologyIndex }
}

export { createGeneratedGameState }
