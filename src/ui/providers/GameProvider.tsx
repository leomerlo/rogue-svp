import { useReducer } from 'react'
import { gameReducer } from '@/game/gameReducer'
import { GameContext } from '@/ui/context/GameContext'
import type { GameState } from '@/game/types'
import type { ReactNode } from 'react'

type GameProviderProps = {
  initialState: GameState
  children: ReactNode
}

export function GameProvider({ initialState, children }: GameProviderProps) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState)
  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}