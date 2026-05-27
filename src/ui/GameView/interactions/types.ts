import type { InteractionAction } from '@/game/types'

type ResolvedAction = InteractionAction | null

type HandResolvedAction = Extract<InteractionAction, { type: 'selectCard' | 'deselectCard' }> | null

export type { HandResolvedAction, ResolvedAction }
