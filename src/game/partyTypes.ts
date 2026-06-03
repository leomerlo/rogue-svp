interface PartyType {
  id: string
  label: string
  oneLiner: string
}

const PARTY_TYPES: PartyType[] = [
  {
    id: 'wedding',
    label: 'La Boda',
    oneLiner: '[NAME] se casa con un forastero; los viejos lo miran de reojo.',
  },
  {
    id: 'funeral',
    label: 'El Funeral',
    oneLiner: 'Todos vienen a llorar a [NAME]. Algunos lo conocían.',
  },
  {
    id: 'birthday',
    label: 'El Cumpleaños',
    oneLiner: '[NAME] cumple años y espera que nadie lo olvide.',
  },
  {
    id: 'festival',
    label: 'El Festival',
    oneLiner: '[NAME] organizó el festival del pueblo. Algo va a salir mal.',
  },
  {
    id: 'banquet',
    label: 'El Banquete',
    oneLiner: '[NAME] invita a cenar. La lista de espera dura tres generaciones.',
  },
  {
    id: 'engagement',
    label: 'El Compromiso',
    oneLiner: '[NAME] anunció su compromiso. No todos en la sala sonríen.',
  },
  {
    id: 'baptism',
    label: 'El Bautismo',
    oneLiner: '[NAME] trae al nuevo miembro de la familia. La familia opina.',
  },
  {
    id: 'reunion',
    label: 'La Reunión Familiar',
    oneLiner: '[NAME] convocó a la familia. Nadie sabe exactamente por qué.',
  },
]

export { PARTY_TYPES }
export type { PartyType }
