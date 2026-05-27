import {
  createM11PathInitialState,
  createM11PathLoseState,
  createM11PathMidGameState,
  createM11PathWinState,
} from '@/test/utils/createInitialState'
import { useGameStore } from '@/store/gameStore'

const SCENARIOS = [
  { id: 'initial', label: 'Initial', create: createM11PathInitialState },
  { id: 'midgame', label: 'Mid-game', create: createM11PathMidGameState },
  { id: 'won', label: 'Won', create: createM11PathWinState },
  { id: 'lost', label: 'Lost', create: createM11PathLoseState },
] as const

const ScenarioPicker = () => {
  const setGameState = useGameStore((state) => state.setGameState)

  return (
    <nav
      aria-label="Scenario picker"
      className="flex flex-wrap justify-center gap-2"
      data-testid="scenario-picker"
    >
      {SCENARIOS.map(({ id, label, create }) => (
        <button
          key={id}
          type="button"
          data-testid={`scenario-${id}`}
          className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700"
          onClick={() => setGameState(create())}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}

export default ScenarioPicker
