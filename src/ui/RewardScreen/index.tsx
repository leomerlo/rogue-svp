import type { Relic } from '@/game/relics'
import type { RelicId } from '@/game/types'

type RewardScreenProps = {
  relics: Relic[]
  onSelect: (relicId: RelicId) => void
}

const RewardScreen = ({ relics, onSelect }: RewardScreenProps) => (
  <div className="flex flex-col items-center gap-8" data-testid="reward-screen">
    <h1 className="text-3xl font-bold text-yellow-400">Choose a Relic</h1>
    <div className="flex gap-4">
      {relics.map((relic) => (
        <button
          key={relic.id}
          onClick={() => onSelect(relic.id)}
          className="flex w-48 flex-col gap-2 rounded-lg border border-slate-600 bg-slate-800 p-4 text-left hover:border-yellow-400 hover:bg-slate-700"
          data-testid={`relic-option-${relic.id}`}
        >
          <span className="font-semibold text-yellow-300">{relic.name}</span>
          <span className="text-sm text-slate-300">{relic.description}</span>
        </button>
      ))}
    </div>
  </div>
)

export default RewardScreen
