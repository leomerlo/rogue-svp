import type { DeckParams, GameState, TopologyParams } from '@/game/types'
import { generateDeck } from '@/game/deck'
import { generateTopology, topologyDefToCells } from '@/game/topology'

function createGeneratedGameState(
  topologyParams: TopologyParams,
  deckParams?: DeckParams,
): GameState {
  const topology = generateTopology(topologyParams)
  const seed = deckParams?.seed ?? topologyParams.seed ?? 0
  const deck = generateDeck(topology, { ...deckParams, seed })
  const cells = topologyDefToCells(topology)

  return {
    rows: topology.rows,
    cols: topology.cols,
    cells,
    hand: deck.cards.slice(0, 3),
    deck: deck.cards.slice(3),
    redealsLeft: 4,
    placedCards: {},
    status: 'playing',
    selectedCardId: null,
  }
}

export { createGeneratedGameState }
