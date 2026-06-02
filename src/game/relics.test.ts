import { describe, expect, it } from 'vitest'
import { shuffleAuthoredDeck } from '@/game/authoredDeck'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { getTopology } from '@/game/topologies'
import { createGameStateFromMesa } from '@/game/createGameStateFromMesa'
import { applyMove, reDealCards } from '@/game/movement'
import {
  RELICS,
  applyMesaStartRelics,
  initialRedealsLeft,
  redealPenalty,
} from '@/game/relics'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'

describe('RELICS', () => {
  it('exports all 8 relic definitions with id, name, and description', () => {
    expect(RELICS).toHaveLength(8)
    for (const relic of RELICS) {
      expect(relic.id).toBeTruthy()
      expect(relic.name).toBeTruthy()
      expect(relic.description).toBeTruthy()
    }
    expect(RELICS.map((r) => r.id)).toEqual([
      'extra_redeal',
      'free_first_redeal',
      'peek_5',
      'reveal_hand_next',
      'wild_on_start',
      'wild_on_redeal',
      'score_streak',
      'score_no_loss',
    ])
  })
})

describe('extra_redeal', () => {
  it('starts mesa with 5 redeals instead of 4', () => {
    const state = createGeneratedGameState(0, {
      seed: 42,
      relicsActive: ['extra_redeal'],
    })

    expect(state.redealsLeft).toBe(5)
    expect(state.initialRedealsLeft).toBe(5)
  })

  it('initialRedealsLeft returns 5 when relic is active', () => {
    expect(initialRedealsLeft(['extra_redeal'])).toBe(5)
    expect(initialRedealsLeft([])).toBe(4)
  })
})

describe('free_first_redeal', () => {
  it('waives the first re-deal penalty', () => {
    expect(redealPenalty(['free_first_redeal'], 0)).toBe(0)
    expect(redealPenalty(['free_first_redeal'], 1)).toBe(0)
    expect(redealPenalty(['free_first_redeal'], 2)).toBe(5)
    expect(redealPenalty([], 2)).toBe(10)
  })
})

describe('peek_5', () => {
  it('snapshots the top 5 deck cards at mesa start', () => {
    const topology = getTopology(0)
    const deckCards = shuffleAuthoredDeck(42)
    const state = createGameStateFromMesa(topology, deckCards, {
      deckSeed: 42,
      relicsActive: ['peek_5'],
    })

    expect(state.deckPeek).toHaveLength(5)
    expect(state.deckPeek.map((c) => c.id)).toEqual(state.deck.slice(0, 5).map((c) => c.id))
  })

  it('leaves deckPeek empty without the relic', () => {
    const state = createGeneratedGameState(0, { seed: 42 })
    expect(state.deckPeek).toEqual([])
  })
})

describe('reveal_hand_next', () => {
  it('sets revealedNextDraw before drawing and clears after draw', () => {
    const deckCard = makeCard('deck-1', 'red', 'blue')
    const handCard = makeCard('hand-1', 'green', 'yellow')
    const state = makeState(1, 2, [makeCell(0, 0), makeCell(0, 1)], {
      hand: [handCard],
      deck: [deckCard, makeCard('deck-2', 'blue', 'red')],
      relicsActive: ['reveal_hand_next'],
    })

    const next = applyMove(state, { cardId: 'hand-1', row: 0, col: 0 })

    expect(next.revealedNextDraw).toBeNull()
    expect(next.hand.some((c) => c.id === 'deck-1')).toBe(true)
  })

  it('reveals the next deck card before it is drawn', () => {
    const deckCard = makeCard('deck-1', 'red', 'blue')
    const handCard = makeCard('hand-1', 'green', 'yellow')
    const base = makeState(1, 2, [makeCell(0, 0), makeCell(0, 1)], {
      hand: [handCard],
      deck: [deckCard],
      relicsActive: ['reveal_hand_next'],
    })

    const placed = {
      ...base,
      hand: [] as typeof base.hand,
      cells: base.cells.map((c, i) => (i === 0 ? { ...c, cardId: 'hand-1' } : c)),
      placedCards: { 'hand-1': handCard },
      selectedCardId: null,
    }

    const withReveal =
      placed.deck.length > 0
        ? { ...placed, revealedNextDraw: placed.deck[0]! }
        : placed

    expect(withReveal.revealedNextDraw?.id).toBe('deck-1')
  })
})

describe('wild_on_start', () => {
  it('adds a relic wild card to the hand at mesa start', () => {
    const state = createGeneratedGameState(0, {
      seed: 42,
      relicsActive: ['wild_on_start'],
    })

    expect(state.hand.some((c) => c.id === 'relic-wild-start')).toBe(true)
    expect(state.hand).toHaveLength(4)
  })

  it('applyMesaStartRelics injects a wild when relic is active', () => {
    const base = makeState(1, 1, [makeCell(0, 0)], {
      hand: [makeCard('h1', 'red', 'blue')],
      deck: [],
      relicsActive: ['wild_on_start'],
    })

    const next = applyMesaStartRelics(base)
    expect(next.hand).toHaveLength(2)
    expect(next.hand[1]?.colorA).toBe('wild')
  })
})

describe('wild_on_redeal', () => {
  it('adds a wild card to the hand after re-dealing', () => {
    const hand = [
      makeCard('h1', 'red', 'blue'),
      makeCard('h2', 'green', 'yellow'),
      makeCard('h3', 'blue', 'red'),
    ]
    const deck = [makeCard('d1', 'yellow', 'green')]
    const state = makeState(1, 1, [makeCell(0, 0)], {
      hand,
      deck,
      redealsLeft: 2,
      initialRedealsLeft: 2,
      relicsActive: ['wild_on_redeal'],
    })

    const next = reDealCards(state)

    expect(next.hand.some((c) => c.id.startsWith('relic-wild-redeal-'))).toBe(true)
  })
})
