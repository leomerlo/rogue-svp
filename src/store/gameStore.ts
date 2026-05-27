import { create } from 'zustand'
import { createDefaultGameState } from '../game/defaultGameState'
import type { GameState } from '../game/types'

type GameStateStore = {
  gameState: GameState
  setGameState: (gameState: GameState) => void
}

export const useGameStore = create<GameStateStore>((set) => ({
  gameState: createDefaultGameState(),
  setGameState: (gameState) => set({ gameState }),
}))
