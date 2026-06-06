import { useMemo } from 'react'
import GameView from '@/ui/GameView'
import RewardScreen from '@/ui/RewardScreen'
import RunEndScreen from '@/ui/RunEndScreen'
import SplashScreen from '@/ui/SplashScreen'
import { GameProvider } from '@/ui/providers/GameProvider'
import { RunProvider } from '@/ui/providers/RunProvider'
import { useRun } from '@/ui/hooks/useRun'
import { createRunState } from '@/game/createRunState'
import { createGeneratedGameState } from '@/game/createGeneratedGameState'
import { RELICS } from '@/game/relics'
import { PARTY_TYPES } from '@/game/partyTypes'
import { fillTemplate } from '@/game/fillTemplate'
import { parseCharacterName } from '@/game/nameGenerator'
import { hashStringToSeed, seededRandom, shuffled } from '@/game/seededRandom'

const INITIAL_RUN_STATE = createRunState('run-001')

export function AppContent() {
  const { runState, runDispatch } = useRun()

  const mesaKey = `${runState.seed}-${runState.topologyIndex}`

  const initialGameState = useMemo(
    () => runState.status === 'playing'
      ? createGeneratedGameState(runState.topologyIndex, {
          seed: hashStringToSeed(mesaKey),
          relicsActive: runState.relicsActive,
        })
      : null,
    [runState.seed, runState.topologyIndex, runState.status, runState.relicsActive],
  )

  const rewardRelics = useMemo(() => {
    if (runState.status !== 'reward') return []
    const rewardSeed = hashStringToSeed(`${runState.seed}-reward-${runState.topologyIndex}`)
    const rng = seededRandom(rewardSeed)
    const available = RELICS.filter((r) => !runState.relicsActive.includes(r.id))
    return shuffled(available, rng).slice(0, 3)
  }, [runState.status, runState.seed, runState.topologyIndex, runState.relicsActive])

  if (runState.status === 'splash') {
    const assignment = runState.partyAssignments[runState.topologyIndex]
    const partyType = PARTY_TYPES.find((pt) => pt.id === assignment?.partyTypeId)
    const partyTypeLabel = partyType?.label ?? ''
    const char = parseCharacterName(assignment?.characterName ?? '')
    const oneLiner = fillTemplate(assignment?.oneLiner ?? '', { char })
    return (
      <SplashScreen
        partyTypeLabel={partyTypeLabel}
        oneLiner={oneLiner}
        onDismiss={() => runDispatch({ type: 'startMesa' })}
      />
    )
  }

  if (runState.status === 'won' || runState.status === 'lost') {
    return (
      <RunEndScreen
        status={runState.status}
        scoreTotal={runState.scoreTotal}
        onNewRun={() => runDispatch({ type: 'newRun', seed: `run-${Date.now()}` })}
      />
    )
  }

  if (runState.status === 'reward') {
    return (
      <RewardScreen
        relics={rewardRelics}
        onSelect={(relicId) => {
          runDispatch({ type: 'applyRelic', relicId })
          runDispatch({ type: 'advanceLevel', mesaScore: runState.pendingMesaScore })
        }}
      />
    )
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
