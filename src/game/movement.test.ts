import { describe, expect, it } from 'vitest'
import { applyMove } from './movement'
import { makeCard, makeCell, makeState } from './testUtils'

describe('applyMove', () => {
  it('places a card from hand onto an empty free cell', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cells = [makeCell(0, 0), makeCell(0, 1)]
    const state = makeState(1, 2, cells, { hand: [card] })

    const next = applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 })

    expect(next.cells[0]!.cardId).toBe('c1')
    expect(next.placedCards.c1).toBe(card)
    expect(next.hand).toEqual([])
    expect(next.status).toBe('playing')
  })

  it('does not mutate the input state', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0)
    const state = makeState(1, 1, [cell], { hand: [card] })

    const next = applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 })

    expect(next).not.toBe(state)
    expect(state.cells[0]!.cardId).toBeNull()
    expect(state.hand).toEqual([card])
    expect(state.placedCards).toEqual({})
  })

  it('draws from the top of the deck until the hand has 3 cards', () => {
    const c1 = makeCard('c1', 'red', 'blue')
    const c2 = makeCard('c2', 'green', 'yellow')
    const c3 = makeCard('c3', 'blue', 'green')
    const d1 = makeCard('d1', 'yellow', 'red')
    const d2 = makeCard('d2', 'red', 'green')
    const cells = [makeCell(0, 0), makeCell(0, 1)]
    const state = makeState(1, 2, cells, {
      hand: [c1, c2, c3],
      deck: [d1, d2],
    })

    const next = applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 })

    expect(next.hand.map(c => c.id)).toEqual(['c2', 'c3', 'd1'])
    expect(next.deck.map(c => c.id)).toEqual(['d2'])
  })

  it('draws fewer than 3 cards when the deck runs out', () => {
    const c1 = makeCard('c1', 'red', 'blue')
    const c2 = makeCard('c2', 'green', 'yellow')
    const d1 = makeCard('d1', 'blue', 'green')
    const cells = [makeCell(0, 0), makeCell(0, 1)]
    const state = makeState(1, 2, cells, {
      hand: [c1, c2],
      deck: [d1],
    })

    const next = applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 })

    expect(next.hand.map(c => c.id)).toEqual(['c2', 'd1'])
    expect(next.deck).toEqual([])
  })

  it('sets status to won when the table is full and solved', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'green', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'a' }),
      makeCell(0, 1),
    ]
    const state = makeState(1, 2, cells, {
      hand: [b],
      placedCards: { a },
    })

    const next = applyMove(state, { type: 'place', cardId: 'b', row: 0, col: 1 })

    expect(next.status).toBe('won')
  })

  it('sets status to lost when the table is full but not solved', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'yellow', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'a' }),
      makeCell(0, 1),
    ]
    const state = makeState(1, 2, cells, {
      hand: [b],
      placedCards: { a },
    })

    const next = applyMove(state, { type: 'place', cardId: 'b', row: 0, col: 1 })

    expect(next.status).toBe('lost')
  })

  it('ignores blocked cells when checking if the table is full', () => {
    const a = makeCard('a', 'red', 'blue')
    const b = makeCard('b', 'blue', 'green')
    const cells = [
      makeCell(0, 0, { cardId: 'a' }),
      makeCell(0, 1),
      makeCell(1, 0, { state: 'blocked' }),
      makeCell(1, 1, { state: 'blocked' }),
    ]
    const state = makeState(2, 2, cells, {
      hand: [b],
      placedCards: { a },
    })

    const next = applyMove(state, { type: 'place', cardId: 'b', row: 0, col: 1 })

    expect(next.status).toBe('won')
  })

  it('throws when the target cell is occupied', () => {
    const card = makeCard('c1', 'red', 'blue')
    const occupied = makeCard('c2', 'green', 'yellow')
    const cell = makeCell(0, 0, { cardId: 'c2' })
    const state = makeState(1, 1, [cell], {
      hand: [card],
      placedCards: { c2: occupied },
    })

    expect(() =>
      applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 }),
    ).toThrow('Cell already occupied')
  })

  it('throws when the target cell is blocked', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { state: 'blocked' })
    const state = makeState(1, 1, [cell], { hand: [card] })

    expect(() =>
      applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 }),
    ).toThrow('Cell is blocked')
  })

  it('throws when the card is not in hand', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0)
    const state = makeState(1, 1, [cell], { deck: [card] })

    expect(() =>
      applyMove(state, { type: 'place', cardId: 'c1', row: 0, col: 0 }),
    ).toThrow('Card not found')
  })

  it('throws when coordinates are out of bounds', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0)
    const state = makeState(1, 1, [cell], { hand: [card] })

    expect(() =>
      applyMove(state, { type: 'place', cardId: 'c1', row: 1, col: 0 }),
    ).toThrow('Invalid move')
  })
})
