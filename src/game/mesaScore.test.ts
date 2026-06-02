import { describe, expect, it } from 'vitest'
import { getCardValue } from '@/game/authoredDeck'
import { computeMesaScore } from '@/game/mesaScore'
import type { GameState } from '@/game/types'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'

function wonState(
  placed: Record<string, ReturnType<typeof makeCard>>,
  options: {
    redealsLeft?: number
    initialRedealsLeft?: number
    relicsActive?: GameState['relicsActive']
  } = {},
) {
  return makeState(1, Object.keys(placed).length, [makeCell(0, 0)], {
    placedCards: placed,
    status: 'won',
    redealsLeft: options.redealsLeft ?? 4,
    initialRedealsLeft: options.initialRedealsLeft ?? 4,
    relicsActive: options.relicsActive ?? [],
  })
}

describe('computeMesaScore', () => {
  it('returns 0 when the mesa is not won', () => {
    const state = makeState(1, 1, [makeCell(0, 0)], {
      placedCards: { 'authored-3': makeCard('authored-3', 'red', 'red') },
      status: 'playing',
    })

    expect(computeMesaScore(state)).toBe(0)
  })

  it('scores card sum minus re-deal penalties with no relics', () => {
    const card = makeCard('authored-3', 'red', 'red')
    expect(getCardValue(card)).toBe(5)

    const state = wonState(
      { 'authored-3': card },
      { redealsLeft: 2, initialRedealsLeft: 4 },
    )

    expect(computeMesaScore(state)).toBe(5 - 10)
  })
})

describe('score_streak', () => {
  it('multiplies score by 1.5 rounded down when no re-deals were used', () => {
    const card = makeCard('authored-66', 'yellow', 'yellow')
    expect(getCardValue(card)).toBe(25)

    const state = wonState(
      { 'authored-66': card },
      { relicsActive: ['score_streak'] },
    )

    expect(computeMesaScore(state)).toBe(Math.floor(25 * 1.5))
  })

  it('does not apply streak bonus when re-deals were used', () => {
    const card = makeCard('authored-35', 'green', 'green')
    expect(getCardValue(card)).toBe(10)

    const state = wonState(
      { 'authored-35': card },
      {
        relicsActive: ['score_streak'],
        redealsLeft: 3,
        initialRedealsLeft: 4,
      },
    )

    expect(computeMesaScore(state)).toBe(5)
  })
})

describe('score_no_loss', () => {
  it('clamps score to at least the sum of card values', () => {
    const card = makeCard('authored-3', 'red', 'red')
    const state = wonState(
      { 'authored-3': card },
      {
        relicsActive: ['score_no_loss'],
        redealsLeft: 0,
        initialRedealsLeft: 4,
      },
    )

    expect(computeMesaScore(state)).toBe(5)
  })
})
