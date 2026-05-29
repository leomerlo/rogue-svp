import type { DeckParams, GameState, TopologyParams } from '@/game/types'
import { createGameStateFromMesa } from '@/game/createGameStateFromMesa'
import { generateDeck } from '@/game/deck'
import { generateTopology } from '@/game/topology'

function createGeneratedGameState(
  topologyParams: TopologyParams,
  deckParams?: DeckParams,
): GameState {
  const topology = generateTopology(topologyParams)
  const seed = deckParams?.seed ?? topologyParams.seed ?? 0
  const deck = generateDeck(topology, { ...deckParams, seed })

  return createGameStateFromMesa(topology, deck, {
    deckSeed: seed,
    pinnedCount: topologyParams.pinnedCount ?? 0,
  })
}

export { createGeneratedGameState }
