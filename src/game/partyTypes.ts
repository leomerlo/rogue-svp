interface PartyType {
  id: string
  label: string
  oneLiner: string
}

const PARTY_TYPES: PartyType[] = [
  {
    id: 'wedding',
    label: 'La Boda',
    oneLiner: '[CHAR.name] se casa con un forastero; los viejos lo miran de reojo.',
  },
  {
    id: 'funeral',
    label: 'El Funeral',
    oneLiner: 'Todos vienen a llorar a [CHAR.name]. Algunos lo conocían.',
  },
  {
    id: 'birthday',
    label: 'El Cumpleaños',
    oneLiner: '[CHAR.name] cumple años y espera que nadie lo olvide.',
  },
  {
    id: 'festival',
    label: 'El Festival',
    oneLiner: '[CHAR.name] organizó el festival del pueblo. Algo va a salir mal.',
  },
  {
    id: 'banquet',
    label: 'El Banquete',
    oneLiner: '[CHAR.name] invita a cenar. La lista de espera dura tres generaciones.',
  },
  {
    id: 'engagement',
    label: 'El Compromiso',
    oneLiner: '[CHAR.name] anunció su compromiso. No todos en la sala sonríen.',
  },
  {
    id: 'baptism',
    label: 'El Bautismo',
    oneLiner: '[CHAR.name] trae al nuevo miembro de la familia. La familia opina.',
  },
  {
    id: 'reunion',
    label: 'La Reunión Familiar',
    oneLiner: '[CHAR.name] convocó a la familia. Nadie sabe exactamente por qué.',
  },
]

export { PARTY_TYPES }
export type { PartyType }
