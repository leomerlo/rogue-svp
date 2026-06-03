import { useReducer } from 'react'
import { runReducer } from '@/game/runReducer'
import { RunContext } from '@/ui/context/RunContext'
import type { RunState } from '@/game/types'
import type { ReactNode } from 'react'

type RunProviderProps = {
  initialState: RunState
  children: ReactNode
}

export function RunProvider({ initialState, children }: RunProviderProps) {
  const [runState, runDispatch] = useReducer(runReducer, initialState)
  return (
    <RunContext.Provider value={{ runState, runDispatch }}>
      {children}
    </RunContext.Provider>
  )
}
