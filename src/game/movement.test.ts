import { describe, expect, it, vi } from 'vitest'
import { shuffleDeck } from '@/game/helpers'
import { applyMove, deselectCard, reDealCards, selectCard, swapCard } from '@/game/movement'
import { makeCard, makeCell, makeState } from '@/test/utils/factories'

describe('selectCard', () => {
  it('sets selectedCardId when the card is in hand', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [card] })

    const next = selectCard(state, 'c1')

    expect(next.selectedCardId).toBe('c1')
  })

  it('replaces an existing selection', () => {
    const c1 = makeCard('c1', 'red', 'blue')
    const c2 = makeCard('c2', 'green', 'yellow')
    const state = makeState(1, 1, [makeCell(0, 0)], {
      hand: [c1, c2],
    })

    const next = selectCard(selectCard(state, 'c1'), 'c2')

    expect(next.selectedCardId).toBe('c2')
  })

  it('does not mutate the input state', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [card] })

    const next = selectCard(state, 'c1')

    expect(next).not.toBe(state)
    expect(state.selectedCardId).toBeNull()
  })

  it('throws when the card is not in hand, deck, or placedCards', () => {
    const state = makeState(1, 1, [makeCell(0, 0)])

    expect(() => selectCard(state, 'missing')).toThrow('Card not found')
  })
})

describe('deselectCard', () => {
  it('clears selectedCardId', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = selectCard(makeState(1, 1, [makeCell(0, 0)], { hand: [card] }), 'c1')

    const next = deselectCard(state)

    expect(next.selectedCardId).toBeNull()
  })

  it('does not mutate the input state', () => {
    const card = makeCard('c1', 'red', 'blue')
    const state = selectCard(makeState(1, 1, [makeCell(0, 0)], { hand: [card] }), 'c1')

    const next = deselectCard(state)

    expect(next).not.toBe(state)
    expect(state.selectedCardId).toBe('c1')
  })
})

describe('shuffleDeck', () => {
  it('returns a deck with the same cards', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const d3 = makeCard('d3', 'blue', 'green')
    const deck = [d1, d2, d3]

    const next = shuffleDeck(deck)

    expect(next.map(card => card.id).sort()).toEqual(['d1', 'd2', 'd3'])
  })

  it('does not mutate the input deck', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const deck = [d1, d2]

    const next = shuffleDeck(deck)

    expect(next).not.toBe(deck)
    expect(deck.map(card => card.id)).toEqual(['d1', 'd2'])
  })

  it('reorders the deck using Math.random', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const d3 = makeCard('d3', 'blue', 'green')
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const next = shuffleDeck([d1, d2, d3])

    expect(next.map(card => card.id)).toEqual(['d3', 'd2', 'd1'])
    randomSpy.mockRestore()
  })
})

describe('reDealCards', () => {
  it('does nothing when redealsLeft is 0', () => {
    const hand = [makeCard('h1', 'red', 'blue')]
    const state = { ...makeState(1, 1, [makeCell(0, 0)], { hand }), redealsLeft: 0 }

    const next = reDealCards(state)

    expect(next).toBe(state)
  })

  it('decrements redealsLeft', () => {
    const hand = [
      makeCard('h1', 'red', 'blue'),
      makeCard('h2', 'green', 'yellow'),
      makeCard('h3', 'blue', 'green'),
    ]
    const state = { ...makeState(1, 1, [makeCell(0, 0)], { hand }), redealsLeft: 2 }

    const next = reDealCards(state)

    expect(next.redealsLeft).toBe(1)
  })

  it('keeps every unplaced card in hand or deck', () => {
    const hand = [
      makeCard('h1', 'red', 'blue'),
      makeCard('h2', 'green', 'yellow'),
    ]
    const deck = [makeCard('d1', 'blue', 'green'), makeCard('d2', 'yellow', 'red')]
    const state = makeState(1, 1, [makeCell(0, 0)], { hand, deck })

    const next = reDealCards(state)

    const before = [...hand, ...deck].map(card => card.id).sort()
    const after = [...next.hand, ...next.deck].map(card => card.id).sort()
    expect(after).toEqual(before)
  })

  it('returns hand cards to the pool and draws 3 after shuffling', () => {
    const h1 = makeCard('h1', 'red', 'blue')
    const h2 = makeCard('h2', 'green', 'yellow')
    const h3 = makeCard('h3', 'blue', 'green')
    const d1 = makeCard('d1', 'yellow', 'red')
    const d2 = makeCard('d2', 'red', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [h1, h2, h3], deck: [d1, d2] })
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const next = reDealCards(state)

    expect(next.hand.map(card => card.id)).toEqual(['h3', 'h2', 'h1'])
    expect(next.deck.map(card => card.id)).toEqual(['d2', 'd1'])
    randomSpy.mockRestore()
  })

  it('draws fewer than 3 cards when the pool is smaller', () => {
    const h1 = makeCard('h1', 'red', 'blue')
    const h2 = makeCard('h2', 'green', 'yellow')
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [h1], deck: [h2] })

    const next = reDealCards(state)

    expect(next.hand).toHaveLength(2)
    expect(next.deck).toEqual([])
  })

  it('does not mutate the input state', () => {
    const hand = [
      makeCard('h1', 'red', 'blue'),
      makeCard('h2', 'green', 'yellow'),
      makeCard('h3', 'blue', 'green'),
    ]
    const deck = [makeCard('d1', 'yellow', 'red')]
    const state = makeState(1, 1, [makeCell(0, 0)], { hand, deck })

    const next = reDealCards(state)

    expect(next).not.toBe(state)
    expect(state.hand.map(card => card.id)).toEqual(['h1', 'h2', 'h3'])
    expect(state.deck.map(card => card.id)).toEqual(['d1'])
    expect(state.redealsLeft).toBe(4)
  })

  it('does not change placed cards on the board', () => {
    const placed = makeCard('a', 'red', 'green')
    const hand = [
      makeCard('h1', 'red', 'blue'),
      makeCard('h2', 'green', 'yellow'),
      makeCard('h3', 'blue', 'green'),
    ]
    const deck = [makeCard('d1', 'yellow', 'red')]
    const cells = [makeCell(0, 0, { cardId: 'a' }), makeCell(0, 1)]
    const state = makeState(1, 2, cells, { hand, deck, placedCards: { a: placed } })

    const next = reDealCards(state)

    expect(next.cells[0]!.cardId).toBe('a')
    expect(next.placedCards).toEqual({ a: placed })
  })
})

describe('applyMove', () => {
  it('places a card from hand onto an empty free cell', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cells = [makeCell(0, 0), makeCell(0, 1)]
    const state = makeState(1, 2, cells, { hand: [card] })

    const next = applyMove(state, { cardId: 'c1', row: 0, col: 0 })

    expect(next.cells[0]!.cardId).toBe('c1')
    expect(next.placedCards.c1).toBe(card)
    expect(next.hand).toEqual([])
    expect(next.status).toBe('playing')
  })

  it('does not mutate the input state', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0)
    const state = makeState(1, 1, [cell], { hand: [card] })

    const next = applyMove(state, { cardId: 'c1', row: 0, col: 0 })

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

    const next = applyMove(state, { cardId: 'c1', row: 0, col: 0 })

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

    const next = applyMove(state, { cardId: 'c1', row: 0, col: 0 })

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

    const next = applyMove(state, { cardId: 'b', row: 0, col: 1 })

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

    const next = applyMove(state, { cardId: 'b', row: 0, col: 1 })

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

    const next = applyMove(state, { cardId: 'b', row: 0, col: 1 })

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
      applyMove(state, { cardId: 'c1', row: 0, col: 0 }),
    ).toThrow('Cell already occupied')
  })

  it('throws when the target cell is blocked', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { state: 'blocked' })
    const state = makeState(1, 1, [cell], { hand: [card] })

    expect(() =>
      applyMove(state, { cardId: 'c1', row: 0, col: 0 }),
    ).toThrow('Cell is blocked')
  })

  it('throws when the card is not in hand', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0)
    const state = makeState(1, 1, [cell], { deck: [card] })

    expect(() =>
      applyMove(state, { cardId: 'c1', row: 0, col: 0 }),
    ).toThrow('Card not found')
  })

  it('throws when coordinates are out of bounds', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0)
    const state = makeState(1, 1, [cell], { hand: [card] })

    expect(() =>
      applyMove(state, { cardId: 'c1', row: 1, col: 0 }),
    ).toThrow('Invalid move')
  })
})

describe('swapCard', () => {
  it('moves a placed card into an empty cell', () => {
    const a = makeCard('a', 'red', 'green')
    const cells = [makeCell(0, 0, { cardId: 'a' }), makeCell(0, 1)]
    const state = makeState(1, 2, cells, { placedCards: { a }, selectedCardId: 'a' })

    const next = swapCard(state, {
      from: { row: 0, col: 0 },
      to: { row: 0, col: 1 },
    })

    expect(next.cells[0]!.cardId).toBeNull()
    expect(next.cells[1]!.cardId).toBe('a')
    expect(next.selectedCardId).toBeNull()
  })

  it('swaps two placed cards', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'blue', 'yellow')
    const cells = [makeCell(0, 0, { cardId: 'a' }), makeCell(0, 1, { cardId: 'b' })]
    const state = makeState(1, 2, cells, { placedCards: { a, b }, selectedCardId: 'a' })

    const next = swapCard(state, {
      from: { row: 0, col: 0 },
      to: { row: 0, col: 1 },
    })

    expect(next.cells[0]!.cardId).toBe('b')
    expect(next.cells[1]!.cardId).toBe('a')
  })

  it('does not swap when game is not playing', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'blue', 'yellow')
    const cells = [makeCell(0, 0, { cardId: 'a' }), makeCell(0, 1, { cardId: 'b' })]
    const wonState = makeState(1, 2, cells, { placedCards: { a, b }, status: 'won' })
    const lostState = makeState(1, 2, cells, { placedCards: { a, b }, status: 'lost' })

    expect(swapCard(wonState, { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } })).toBe(wonState)
    expect(swapCard(lostState, { from: { row: 0, col: 0 }, to: { row: 0, col: 1 } })).toBe(lostState)
  })

  it('throws when the source cell is empty', () => {
    const a = makeCard('a', 'red', 'green')
    const cells = [makeCell(0, 0), makeCell(0, 1, { cardId: 'a' })]
    const state = makeState(1, 2, cells, { placedCards: { a } })

    expect(() =>
      swapCard(state, {
        from: { row: 0, col: 0 },
        to: { row: 0, col: 1 },
      }),
    ).toThrow('Source cell is empty')
  })
})
