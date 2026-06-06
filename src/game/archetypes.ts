import type { Archetype } from '@/game/types'

const ARCHETYPES: Archetype[] = [
  {
    id: 'snob',
    label: 'El Snob',
    socialPosture: 'Establece jerarquías sociales desde el primer saludo',
    comicWeakness: 'Su glorioso linaje se remonta exactamente dos generaciones',
  },
  {
    id: 'heir',
    label: 'La Heredera',
    socialPosture: 'Recibe a todos con la misma sonrisa fría que heredó de su madre',
    comicWeakness: 'La fortuna existe sólo en los cuadros que cuelgan en el pasillo',
  },
  {
    id: 'diplomat',
    label: 'El Diplomático',
    socialPosture: 'Nunca dice lo que piensa pero siempre hace lo que conviene',
    comicWeakness: 'Se ofende profundamente cuando alguien le habla con claridad',
  },
  {
    id: 'femme_fatale',
    label: 'La Femme Fatale',
    socialPosture: 'Entra en una habitación y reorganiza las lealtades sin decir una palabra',
    comicWeakness: 'Lleva veinte años huyendo del mismo malentendido',
  },
  {
    id: 'bohemian',
    label: 'El Bohemio',
    socialPosture: 'Desprecia las convenciones sociales en reuniones sociales muy concurridas',
    comicWeakness: 'Su obra maestra lleva doce años en proceso y tres páginas escritas',
  },
  {
    id: 'matriarch',
    label: 'La Matriarca',
    socialPosture: 'Organiza vidas ajenas con la precisión de quien tiene demasiado tiempo libre',
    comicWeakness: 'Nadie le ha dicho que el pueblo ya no le teme, sólo la aguanta',
  },
  {
    id: 'rogue',
    label: 'El Pícaro',
    socialPosture: 'Conoce a todo el mundo y nadie sabe exactamente cómo',
    comicWeakness: 'Sus negocios son siempre "a punto de cerrar" desde hace una década',
  },
  {
    id: 'scholar',
    label: 'El Erudito',
    socialPosture: 'Cita autores que nadie ha leído para zanjar conversaciones que nadie pidió',
    comicWeakness: 'Le aterra que descubran que no leyó el libro que cita con más frecuencia',
  },
  {
    id: 'wallflower',
    label: 'La Discreta',
    socialPosture: 'Observa desde los márgenes y sabe más de todos que todos juntos',
    comicWeakness: 'Cuando por fin habla, nadie está escuchando',
  },
]

export { ARCHETYPES }
