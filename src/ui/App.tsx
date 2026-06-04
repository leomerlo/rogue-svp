import { useMemo } from 'react'
import GameView from '@/ui/GameView'
import { GameProvider } from '@/ui/providers/GameProvider'
import { RunProvider } from '@/ui/providers/RunProvider'
import { useRun } from '@/ui/hooks/useRun'
import { createRunState } from '@/game/createRunState'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { hashStringToSeed } from '@/game/seededRandom'

const INITIAL_RUN_STATE = createRunState('run-001')

export function AppContent() {
  const { runState } = useRun()

  const mesaKey = `${runState.seed}-${runState.topologyIndex}`

  const initialGameState = useMemo(
    () => runState.status === 'playing'
      ? createGeneratedGameState(runState.topologyIndex, { seed: hashStringToSeed(mesaKey) })
      : null,
    [runState.seed, runState.topologyIndex, runState.status],
  )

  if (runState.status === 'won') {
    return <div data-testid="run-complete">Run Complete!</div>
  }

  if (runState.status === 'lost') {
    return <div data-testid="game-over">Game Over</div>
  }

  return (
    // initialGameState is non-null here: status === 'playing' is guaranteed above
    <GameProvider key={mesaKey} initialState={initialGameState!}>
      <GameView />
    </GameProvider>
  )
}

const App = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100">
    <RunProvider initialState={INITIAL_RUN_STATE}>
      <AppContent />
    </RunProvider>
  </main>
)

export default App
