import { describe, expect, it, vi } from 'vitest'
import {
  edgeColor,
  touchingSides,
  edgesMatch,
  neighborsOf,
  isHappy,
  isSolved,
  getCard,
  getCardCellIndex,
  getCardZone,
  isCardInDeck,
  isCardInHand,
  isCardInPlacedCards,
  shuffleDeck,
} from '@/game/helpers'
import { makeCard, makeCell, makeState, makeWildCard } from '@/test/utils/factories'

describe('getCard', () => {
  const placed = makeCard('placed', 'red', 'blue')
  const inHand = makeCard('hand', 'green', 'yellow')
  const inDeck = makeCard('deck', 'blue', 'green')

  it('returns a card from placedCards', () => {
    const state = makeState(1, 1, [makeCell(0, 0)], { placedCards: { placed } })

    expect(getCard(state, 'placed')).toBe(placed)
  })

  it('returns a card from hand when not placed', () => {
    const state = makeState(1, 1, [makeCell(0, 0)], { hand: [inHand] })

    expect(getCard(state, 'hand')).toBe(inHand)
  })

  it('returns a card from deck when not placed or in hand', () => {
    const state = makeState(1, 1, [makeCell(0, 0)], { deck: [inDeck] })

    expect(getCard(state, 'deck')).toBe(inDeck)
  })

  it('prefers placedCards over hand and deck', () => {
    const duplicate = makeCard('dup', 'red', 'red')
    const handCopy = makeCard('dup', 'blue', 'blue')
    const deckCopy = makeCard('dup', 'green', 'green')
    const state = makeState(1, 1, [makeCell(0, 0)], {
      placedCards: { dup: duplicate },
      hand: [handCopy],
      deck: [deckCopy],
    })

    expect(getCard(state, 'dup')).toBe(duplicate)
  })

  it('returns null when the card is not found', () => {
    const state = makeState(1, 1, [makeCell(0, 0)])

    expect(getCard(state, 'missing')).toBeNull()
  })
})

describe('card location helpers', () => {
  const placed = makeCard('placed', 'red', 'blue')
  const inHand = makeCard('hand', 'green', 'yellow')
  const inDeck = makeCard('deck', 'blue', 'green')
  const state = makeState(1, 1, [makeCell(0, 0)], {
    placedCards: { placed },
    hand: [inHand],
    deck: [inDeck],
  })

  it('resolves each card zone correctly', () => {
    expect(getCardZone(state, 'placed')).toBe('placed')
    expect(getCardZone(state, 'hand')).toBe('hand')
    expect(getCardZone(state, 'deck')).toBe('deck')
    expect(getCardZone(state, 'missing')).toBeNull()
  })

  it('reuses zone lookup in boolean helpers', () => {
    expect(isCardInPlacedCards(state, 'placed')).toBe(true)
    expect(isCardInHand(state, 'hand')).toBe(true)
    expect(isCardInDeck(state, 'deck')).toBe(true)
    expect(isCardInHand(state, 'deck')).toBe(false)
  })

  it('returns the cell index for a placed card id', () => {
    const cells = [
      makeCell(0, 0),
      makeCell(0, 1, { cardId: 'placed' }),
      makeCell(0, 2),
    ]
    const boardState = makeState(1, 3, cells, { placedCards: { placed } })

    expect(getCardCellIndex(boardState, 'placed')).toBe(1)
    expect(getCardCellIndex(boardState, 'missing')).toBe(-1)
  })
})

describe('edgeColor', () => {
  const card = makeCard('c1', 'red', 'blue')

  it('returns colorA for top and left', () => {
    expect(edgeColor(card, 'top')).toBe('red')
    expect(edgeColor(card, 'left')).toBe('red')
  })

  it('returns colorB for bottom and right', () => {
    expect(edgeColor(card, 'bottom')).toBe('blue')
    expect(edgeColor(card, 'right')).toBe('blue')
  })
})

describe('touchingSides', () => {
  const origin = makeCell(1, 1)

  it('identifies vertical adjacency', () => {
    expect(touchingSides(origin, makeCell(0, 1))).toEqual({
      mySide: 'top',
      theirSide: 'bottom',
    })
    expect(touchingSides(origin, makeCell(2, 1))).toEqual({
      mySide: 'bottom',
      theirSide: 'top',
    })
  })

  it('identifies horizontal adjacency', () => {
    expect(touchingSides(origin, makeCell(1, 0))).toEqual({
      mySide: 'left',
      theirSide: 'right',
    })
    expect(touchingSides(origin, makeCell(1, 2))).toEqual({
      mySide: 'right',
      theirSide: 'left',
    })
  })

  it('throws when cells are not adjacent', () => {
    expect(() => touchingSides(origin, makeCell(3, 3))).toThrow('not adjacent')
  })
})

describe('edgesMatch', () => {
  it('returns true when touching edges share a color', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'green', 'blue')

    expect(edgesMatch(a, 'bottom', b, 'top')).toBe(true)
  })

  it('returns false when touching edges differ', () => {
    const a = makeCard('a', 'red', 'blue')
    const b = makeCard('b', 'green', 'yellow')

    expect(edgesMatch(a, 'right', b, 'left')).toBe(false)
  })

  it('wild card matches any regular color on any side', () => {
    const wild = makeWildCard('w')
    const red = makeCard('r', 'red', 'red')

    expect(edgesMatch(wild, 'right', red, 'left')).toBe(true)
    expect(edgesMatch(wild, 'bottom', red, 'top')).toBe(true)
    expect(edgesMatch(wild, 'left', red, 'right')).toBe(true)
    expect(edgesMatch(wild, 'top', red, 'bottom')).toBe(true)
  })

  it('any regular color matches a wild card neighbor', () => {
    const wild = makeWildCard('w')
    const blue = makeCard('b', 'blue', 'green')

    expect(edgesMatch(blue, 'right', wild, 'left')).toBe(true)
    expect(edgesMatch(blue, 'bottom', wild, 'top')).toBe(true)
  })

  it('two wild cards always match', () => {
    const w1 = makeWildCard('w1')
    const w2 = makeWildCard('w2')

    expect(edgesMatch(w1, 'right', w2, 'left')).toBe(true)
  })
})

describe('neighborsOf', () => {
  it('returns adjacent seats, excluding blocked cells', () => {
    const cells = [
      makeCell(0, 0),
      makeCell(0, 1),
      makeCell(1, 0, { state: 'blocked' }),
      makeCell(1, 1),
    ]
    const gameState = makeState(2, 2, cells)

    expect(neighborsOf(cells[0]!, gameState).map(c => [c.row, c.col])).toEqual([[0, 1]])
  })

  it('includes occupied adjacent seats', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'green', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'left' }),
      makeCell(0, 1, { cardId: 'right' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { left, right } })

    expect(neighborsOf(cells[0]!, gameState)).toHaveLength(1)
    expect(neighborsOf(cells[0]!, gameState)[0]!.cardId).toBe('right')
  })

  it('excludes out-of-bounds positions', () => {
    const cells = [makeCell(0, 0), makeCell(0, 1), makeCell(1, 0), makeCell(1, 1)]
    const gameState = makeState(2, 2, cells)

    expect(neighborsOf(cells[0]!, gameState)).toHaveLength(2)
    expect(neighborsOf(cells[3]!, gameState)).toHaveLength(2)
  })
})

describe('isHappy', () => {
  it('returns false for an empty cell', () => {
    const cell = makeCell(0, 0)
    const gameState = makeState(1, 1, [cell])

    expect(isHappy(cell, gameState)).toBe(false)
  })

  it('returns true for an isolated placed card', () => {
    const card = makeCard('c1', 'red', 'blue')
    const cell = makeCell(0, 0, { cardId: 'c1' })
    const gameState = makeState(1, 1, [cell], { placedCards: { c1: card } })

    expect(isHappy(cell, gameState)).toBe(true)
  })

  it('returns true when all card neighbors have matching edges', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'green', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'left' }),
      makeCell(0, 1, { cardId: 'right' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { left, right } })

    expect(isHappy(cells[0]!, gameState)).toBe(true)
    expect(isHappy(cells[1]!, gameState)).toBe(true)
  })

  it('returns false when an adjacent seat is empty', () => {
    const card = makeCard('c1', 'red', 'green')
    const cells = [
      makeCell(0, 0, { cardId: 'c1' }),
      makeCell(0, 1),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { c1: card } })

    expect(isHappy(cells[0]!, gameState)).toBe(false)
  })

  it('returns false when a card neighbor has a mismatched edge', () => {
    const left = makeCard('left', 'red', 'green')
    const right = makeCard('right', 'yellow', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'left' }),
      makeCell(0, 1, { cardId: 'right' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { left, right } })

    expect(isHappy(cells[0]!, gameState)).toBe(false)
    expect(isHappy(cells[1]!, gameState)).toBe(false)
  })

  it('wild card is happy next to any color', () => {
    const wild = makeWildCard('w')
    const red = makeCard('r', 'red', 'yellow')
    const cells = [
      makeCell(0, 0, { cardId: 'w' }),
      makeCell(0, 1, { cardId: 'r' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { w: wild, r: red } })

    expect(isHappy(cells[0]!, gameState)).toBe(true)
  })

  it('regular card is happy next to a wild card regardless of edge color', () => {
    const wild = makeWildCard('w')
    const blue = makeCard('b', 'blue', 'green')
    const cells = [
      makeCell(0, 0, { cardId: 'w' }),
      makeCell(0, 1, { cardId: 'b' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { w: wild, b: blue } })

    expect(isHappy(cells[1]!, gameState)).toBe(true)
  })
})

describe('isSolved', () => {
  it('returns true when every cell is occupied and happy', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'green', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'a' }),
      makeCell(0, 1, { cardId: 'b' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { a, b } })

    expect(isSolved(gameState)).toBe(true)
  })

  it('returns false when any cell is empty or unhappy', () => {
    const a = makeCard('a', 'red', 'green')
    const b = makeCard('b', 'yellow', 'blue')
    const cells = [
      makeCell(0, 0, { cardId: 'a' }),
      makeCell(0, 1, { cardId: 'b' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { a, b } })

    expect(isSolved(gameState)).toBe(false)
  })

  it('returns false when a cell has no card', () => {
    const a = makeCard('a', 'red', 'blue')
    const cells = [makeCell(0, 0, { cardId: 'a' }), makeCell(0, 1)]
    const gameState = makeState(1, 2, cells, { placedCards: { a } })

    expect(isSolved(gameState)).toBe(false)
  })

  it('returns true when a pinned cell is occupied and happy', () => {
    const pinned = makeCard('p', 'red', 'green')
    const free = makeCard('f', 'green', 'blue')
    const cells = [
      makeCell(0, 0, { state: 'pinned', cardId: 'p' }),
      makeCell(0, 1, { cardId: 'f' }),
    ]
    const gameState = makeState(1, 2, cells, { placedCards: { p: pinned, f: free } })

    expect(isSolved(gameState)).toBe(true)
  })
})

describe('shuffleDeck', () => {
  it('returns a permutation of the input cards', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const d3 = makeCard('d3', 'blue', 'green')

    const next = shuffleDeck([d1, d2, d3])

    expect(next.map(card => card.id).sort()).toEqual(['d1', 'd2', 'd3'])
  })

  it('does not mutate the input array', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const deck = [d1, d2]

    const next = shuffleDeck(deck)

    expect(next).not.toBe(deck)
    expect(deck.map(card => card.id)).toEqual(['d1', 'd2'])
  })

  it('returns an empty array unchanged', () => {
    expect(shuffleDeck([])).toEqual([])
  })

  it('returns a single-card deck unchanged', () => {
    const d1 = makeCard('d1', 'red', 'blue')

    expect(shuffleDeck([d1])).toEqual([d1])
  })

  it('shuffles with Fisher-Yates using Math.random', () => {
    const d1 = makeCard('d1', 'red', 'blue')
    const d2 = makeCard('d2', 'green', 'yellow')
    const d3 = makeCard('d3', 'blue', 'green')
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)

    const next = shuffleDeck([d1, d2, d3])

    // random=0 always picks j=0: swap tail with index 0 each pass
    expect(next.map(card => card.id)).toEqual(['d2', 'd3', 'd1'])
    expect(randomSpy).toHaveBeenCalledTimes(2)
    randomSpy.mockRestore()
  })
})
