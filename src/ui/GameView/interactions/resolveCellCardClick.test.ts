import { describe, expect, it } from 'vitest'
import { resolveCellCardClick } from '@/ui/GameView/interactions/resolveCellCardClick'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'

describe('resolveCellCardClick', () => {
  it('returns selectCard when clicking a placed card with no selection', () => {
    const placed = makeCard('p1', 'red', 'green')
    const cell = makeCell(0, 0, { cardId: 'p1' })
    const state = makeState(1, 1, [cell], { placedCards: { p1: placed } })

    expect(resolveCellCardClick(state, cell)).toEqual({ type: 'selectCard', cardId: 'p1' })
  })

  it('returns deselectCard when clicking the selected card', () => {
    const placed = makeCard('p1', 'red', 'green')
    const cell = makeCell(0, 0, { cardId: 'p1' })
    const state = makeState(1, 1, [cell], { placedCards: { p1: placed }, selectedCardId: 'p1' })

    expect(resolveCellCardClick(state, cell)).toEqual({ type: 'deselectCard' })
  })

  it('returns placeCard when selected card comes from hand', () => {
    const handCard = makeCard('h1', 'blue', 'yellow')
    const target = makeCell(0, 0)
    const state = makeState(1, 1, [target], { hand: [handCard], selectedCardId: 'h1' })

    expect(resolveCellCardClick(state, target)).toEqual({
      type: 'placeCard',
      move: { cardId: 'h1', row: 0, col: 0 },
    })
  })

  it('returns swapCard when selected card comes from the board', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'blue', 'yellow')
    const from = makeCell(0, 0, { cardId: 'a' })
    const to = makeCell(0, 1, { cardId: 'b' })
    const state = makeState(1, 2, [from, to], {
      placedCards: { a, b },
      selectedCardId: 'a',
    })

    expect(resolveCellCardClick(state, to)).toEqual({
      type: 'swapCard',
      move: { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } },
    })
  })

  it('returns null when clicking a pinned cell', () => {
    const placed = makeCard('p1', 'red', 'green')
    const cell = makeCell(0, 0, { state: 'pinned', cardId: 'p1' })
    const state = makeState(1, 1, [cell], { placedCards: { p1: placed } })

    expect(resolveCellCardClick(state, cell)).toBeNull()
  })

  it('returns null when game is over', () => {
    const placed = makeCard('p1', 'red', 'green')
    const cell = makeCell(0, 0, { cardId: 'p1' })
    const wonState = makeState(1, 1, [cell], { placedCards: { p1: placed }, status: 'won' })
    const lostState = makeState(1, 1, [cell], { placedCards: { p1: placed }, status: 'lost' })

    expect(resolveCellCardClick(wonState, cell)).toBeNull()
    expect(resolveCellCardClick(lostState, cell)).toBeNull()
  })
})
