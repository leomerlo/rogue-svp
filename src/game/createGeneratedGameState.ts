import type { GameState } from '@/game/types'
import { createGameStateFromMesa } from '@/game/createGameStateFromMesa'
import { generateDeck } from '@/game/deck'
import { getTopology } from '@/game/topologies'

type GeneratedGameOptions = {
  seed?: number
  pinnedCount?: number
}

function createGeneratedGameState(
  topologyIndex: number,
  options: GeneratedGameOptions = {},
): GameState {
  const topology = getTopology(topologyIndex)
  const seed = options.seed ?? 0
  const deck = generateDeck(topology, { ...topology.deckParams, seed })

  const state = createGameStateFromMesa(topology, deck, {
    deckSeed: seed,
    pinnedCount: options.pinnedCount ?? 0,
  })

  return { ...state, topologyIndex }
}

export { createGeneratedGameState }
