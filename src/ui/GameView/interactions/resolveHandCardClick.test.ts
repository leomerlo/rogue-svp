import { describe, expect, it } from 'vitest'
import { resolveHandCardClick } from '@/ui/GameView/interactions/resolveHandCardClick'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'

describe('resolveHandCardClick', () => {
  it('returns selectCard when clicking an unselected hand card', () => {
    const card = makeCard('h1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [card] })

    expect(resolveHandCardClick(state, 'h1')).toEqual({ type: 'selectCard', cardId: 'h1' })
  })

  it('returns deselectCard when clicking the selected hand card', () => {
    const card = makeCard('h1', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [card], selectedCardId: 'h1' })

    expect(resolveHandCardClick(state, 'h1')).toEqual({ type: 'deselectCard' })
  })

  it('returns null when game is over', () => {
    const card = makeCard('h1', 'red', 'green')
    const wonState = makeState(1, 1, [makeCell(0, 0)], { hand: [card], status: 'won' })
    const lostState = makeState(1, 1, [makeCell(0, 0)], { hand: [card], status: 'lost' })

    expect(resolveHandCardClick(wonState, 'h1')).toBeNull()
    expect(resolveHandCardClick(lostState, 'h1')).toBeNull()
  })
})
