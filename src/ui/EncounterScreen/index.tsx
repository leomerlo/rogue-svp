import { ENCOUNTERS } from '@/game/encounters'
import { fillTemplate } from '@/game/fillTemplate'
import { parseCharacterName } from '@/game/nameGenerator'
import type { EncounterOption } from '@/game/types'
import { useRun } from '@/ui/hooks/useRun'

const EncounterScreen = () => {
  const { runState, runDispatch } = useRun()
  const { encounter, narrativeState } = runState

  const encounterDef = ENCOUNTERS.find((e) => e.id === encounter.encounterId)
  const charA = narrativeState.roster[encounter.charASlotIndex]
  const charB = narrativeState.roster[encounter.charBSlotIndex]

  if (!encounterDef || !charA || !charB) return null

  const roles = { CHARA: charA.name, CHARB: charB.name }
  const char = parseCharacterName(charA.name)

  const prompt = fillTemplate(encounterDef.prompt, { char, roles })

  const handleOption = (option: EncounterOption) => {
    const slotIndex = option.tagTarget === 'charA' ? encounter.charASlotIndex : encounter.charBSlotIndex
    runDispatch({ type: 'resolveEncounter', slotIndex, tag: option.tag, rumores: option.rumores })
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-lg" data-testid="encounter-screen">
      <div className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Encuentro</div>
      <p className="text-lg text-slate-200 italic leading-relaxed">{prompt}</p>
      <div className="flex flex-col gap-3 w-full">
        {encounterDef.options.map((option, i) => {
          const label = fillTemplate(option.label, { char, roles })
          return (
            <button
              key={i}
              onClick={() => handleOption(option)}
              className="rounded-lg bg-slate-700 px-6 py-3 text-left text-slate-100 hover:bg-slate-600 transition-colors"
              data-testid="encounter-option"
            >
              {label}
              <span className="ml-2 text-yellow-400 text-sm">+{option.rumores} rumores</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EncounterScreen
