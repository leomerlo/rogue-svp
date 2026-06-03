import { createContext } from 'react'
import type { RunAction, RunState } from '@/game/types'

export type RunContextValue = {
  runState: RunState
  runDispatch: React.Dispatch<RunAction>
}

export const RunContext = createContext<RunContextValue | null>(null)
