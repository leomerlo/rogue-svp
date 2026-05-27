import { createContext } from 'react'
import type { GameAction, GameState } from '@/game/types'

export type GameContextValue = {
  gameState: GameState
  dispatch: React.Dispatch<GameAction>
}

export const GameContext = createContext<GameContextValue | null>(null)