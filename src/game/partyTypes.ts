interface PartyType {
  id: string
  label: string
  oneLiners: string[]
}

const PARTY_TYPES: PartyType[] = [
  {
    id: 'wedding',
    label: 'La Boda',
    oneLiners: [
      '[CHAR.name] se casa con un forastero; los viejos lo miran de reojo.',
      '[CHAR.name] eligió pareja. La familia eligió no opinar, aunque opina igual.',
      'Dicen que [CHAR.name] se casa por amor. En [CHAR.family] eso nunca fue motivo suficiente.',
      '[CHAR.name] está radiante. Alguien debería avisarle lo que sabe el cura.',
      'La boda de [CHAR.name] fue sencilla. El escándalo, sin embargo, requirió tres horas.',
    ],
  },
  {
    id: 'funeral',
    label: 'El Funeral',
    oneLiners: [
      'Todos vienen a llorar a [CHAR.name]. Algunos lo conocían.',
      '[CHAR.name] murió como vivió: con todas las sillas ocupadas y algún conflicto sin resolver.',
      'El velorio de [CHAR.name] duró más de lo planeado. Ciertas conversaciones no pueden cortarse a tiempo.',
      'Nadie mencionó lo que todo el mundo sabe al hablar de [CHAR.name]. Fue, dicen, lo más honesto del acto.',
      '[CHAR.name] dejó instrucciones precisas. Nadie las leyó hasta que fue tarde para ignorarlas.',
    ],
  },
  {
    id: 'birthday',
    label: 'El Cumpleaños',
    oneLiners: [
      '[CHAR.name] cumple años y espera que nadie lo olvide.',
      'Alguien olvidó el pastel de [CHAR.name]. Ese alguien pasará una década recuperándose.',
      '[CHAR.name] había pedido algo íntimo. Lo que vino fue otra cosa.',
      'El brindis por [CHAR.name] fue breve. El silencio que vino después, no.',
      '[CHAR.name] cumple años. Los invitados llegaron; los regalos, a medias.',
    ],
  },
  {
    id: 'festival',
    label: 'El Festival',
    oneLiners: [
      '[CHAR.name] organizó el festival del pueblo. Algo va a salir mal.',
      'El festival de [CHAR.name] es famoso por dos cosas; ninguna de ellas es la música.',
      '[CHAR.name] prometió que este año sería diferente. [CHAR.family] escuchó eso antes.',
      '[CHAR.name] no durmió en tres días preparando el festival. Se nota de maneras distintas.',
      'Dicen que el festival de [CHAR.name] unió al pueblo. Dicen muchas cosas.',
    ],
  },
  {
    id: 'banquet',
    label: 'El Banquete',
    oneLiners: [
      '[CHAR.name] invita a cenar. La lista de espera dura tres generaciones.',
      'Un banquete en casa de [CHAR.name] es un honor. Es también una obligación que no expira.',
      '[CHAR.name] pone la mesa para doce. Sólo once están invitados.',
      'La cocina de [CHAR.name] es legendaria en [CHAR.family]. El postre, sin embargo, es siempre el mismo.',
      '[CHAR.name] preparó cada detalle. El único imprevisto fue la mitad de los invitados.',
    ],
  },
  {
    id: 'engagement',
    label: 'El Compromiso',
    oneLiners: [
      '[CHAR.name] anunció su compromiso. No todos en la sala sonríen.',
      'El compromiso de [CHAR.name] fue una sorpresa para la familia. También para [CHAR.name].',
      'Dos familias, una mesa, demasiadas cosas sin decir: el compromiso de [CHAR.name].',
      '[CHAR.name] eligió bien, o eso cree. [CHAR.family] suspira en silencio.',
      'El anillo de [CHAR.name] llegó tarde. La celebración, antes de lo aconsejable.',
    ],
  },
  {
    id: 'baptism',
    label: 'El Bautismo',
    oneLiners: [
      '[CHAR.name] trae al nuevo miembro de la familia. La familia opina.',
      'El bautismo del hijo de [CHAR.name] reunió a todos. Demasiados para una sola pila.',
      'El hijo de [CHAR.name] nació en [CHAR.family]. Ya le eligieron el oficio, el nombre y el carácter.',
      '[CHAR.name] llora de emoción. El niño también, por razones distintas.',
      'Una nueva vida para [CHAR.name] y [CHAR.family]. El pueblo ya tiene opinión formada.',
    ],
  },
  {
    id: 'reunion',
    label: 'La Reunión Familiar',
    oneLiners: [
      '[CHAR.name] convocó a la familia. Nadie sabe exactamente por qué.',
      'La reunión convocada por [CHAR.name] es anual. La tensión en [CHAR.family] es permanente.',
      '[CHAR.name] prometió que sería cordial. Duró hasta el tercer plato.',
      'Algunos [CHAR.family] no veían a [CHAR.name] hace años. Años que hicieron buen trabajo.',
      '[CHAR.name] tiene algo que anunciar. La familia finge no haberlo imaginado ya.',
    ],
  },
]

export { PARTY_TYPES }
export type { PartyType }
