import type { EncounterDef } from '@/game/types'

const ENCOUNTERS: EncounterDef[] = [
  {
    id: 'secret_engagement',
    prompt: '[CHARA.name] leans close and whispers that [CHARB.name] has been secretly engaged for three weeks. No one else knows. Not even the family.',
    options: [
      {
        label: 'Slip away to congratulate [CHARB.name] quietly.',
        tag: 'married',
        tagTarget: 'charB',
        rumores: 8,
      },
      {
        label: 'Promise [CHARA.name] your silence. This is worth keeping.',
        tag: 'married',
        tagTarget: 'charB',
        rumores: 12,
      },
      {
        label: 'Dismiss it as wishful thinking. [CHARB.name] would never.',
        tag: 'bereaved',
        tagTarget: 'charA',
        rumores: 3,
      },
    ],
  },
  {
    id: 'mourning_corner',
    prompt: '[CHARB.name] sits alone near the window, untouched glass in hand, staring at nothing in particular. [CHARA.name] catches your eye and tilts their head in [CHARB.name]\'s direction.',
    options: [
      {
        label: 'Go sit with [CHARB.name]. Some things require no words.',
        tag: 'bereaved',
        tagTarget: 'charB',
        rumores: 6,
      },
      {
        label: 'Ask [CHARA.name] to check on them instead.',
        tag: 'bereaved',
        tagTarget: 'charA',
        rumores: 4,
      },
    ],
  },
  {
    id: 'new_arrival',
    prompt: '[CHARA.name] corners you near the canapes with barely suppressed delight. [CHARB.name] has had the baby — two nights ago, in absolute secrecy. They wanted no fuss.',
    options: [
      {
        label: 'Toast silently to [CHARB.name]\'s new family.',
        tag: 'newborn',
        tagTarget: 'charB',
        rumores: 10,
      },
      {
        label: 'Express mild concern about the secrecy.',
        tag: 'bereaved',
        tagTarget: 'charA',
        rumores: 3,
      },
      {
        label: 'Ask [CHARA.name] who else has been told.',
        tag: 'newborn',
        tagTarget: 'charB',
        rumores: 7,
      },
    ],
  },
  {
    id: 'widow_suitor',
    prompt: '[CHARA.name] has been widowed six months now. [CHARB.name] has been hovering all evening with the transparent awkwardness of someone who wants to be useful.',
    options: [
      {
        label: 'Subtly encourage [CHARB.name]\'s attention.',
        tag: 'married',
        tagTarget: 'charB',
        rumores: 8,
      },
      {
        label: 'Tell [CHARA.name] they deserve more time.',
        tag: 'bereaved',
        tagTarget: 'charA',
        rumores: 6,
      },
    ],
  },
  {
    id: 'godparent_question',
    prompt: '[CHARB.name] has a newborn and no godparent yet. They ask your opinion with the studied casualness of someone who has thought about nothing else for a week.',
    options: [
      {
        label: 'Suggest [CHARA.name]. They have the temperament for it.',
        tag: 'newborn',
        tagTarget: 'charA',
        rumores: 5,
      },
      {
        label: 'Volunteer nothing. Let [CHARB.name] find their own answer.',
        tag: 'newborn',
        tagTarget: 'charB',
        rumores: 7,
      },
      {
        label: 'Ask whether [CHARA.name] would even accept.',
        tag: 'bereaved',
        tagTarget: 'charB',
        rumores: 4,
      },
    ],
  },
  {
    id: 'quiet_ceremony',
    prompt: 'The news reaches you through the soup course: [CHARA.name] and [CHARB.name] married last month. A Tuesday. A municipal office. Two witnesses from the street.',
    options: [
      {
        label: 'Act surprised. Give [CHARA.name] the satisfaction.',
        tag: 'married',
        tagTarget: 'charA',
        rumores: 5,
      },
      {
        label: 'Tell [CHARB.name] you always suspected.',
        tag: 'married',
        tagTarget: 'charB',
        rumores: 8,
      },
    ],
  },
  {
    id: 'missing_guest',
    prompt: '[CHARB.name] was supposed to arrive by eight. It is now past nine. [CHARA.name] knows why and is deciding whether to tell you.',
    options: [
      {
        label: 'Press [CHARA.name] gently. You can be trusted.',
        tag: 'bereaved',
        tagTarget: 'charB',
        rumores: 10,
      },
      {
        label: 'Make excuses for [CHARB.name] to anyone who asks.',
        tag: 'bereaved',
        tagTarget: 'charB',
        rumores: 4,
      },
      {
        label: 'Let [CHARA.name] carry it. It is not your business.',
        tag: 'bereaved',
        tagTarget: 'charA',
        rumores: 6,
      },
    ],
  },
]

export { ENCOUNTERS }
