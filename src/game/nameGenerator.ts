import type { SeededRandom } from '@/game/seededRandom'

const FIRST_NAMES = [
  'Adela',
  'Alfonso',
  'Beatriz',
  'Carmen',
  'Clara',
  'Diego',
  'Elena',
  'Emilia',
  'Fernando',
  'Gabriela',
  'Héctor',
  'Inés',
  'Isabel',
  'Javier',
  'Laura',
  'Lucía',
  'Manuel',
  'María',
  'Marta',
  'Miguel',
  'Natalia',
  'Pablo',
  'Patricia',
  'Raquel',
  'Ricardo',
  'Rocío',
  'Sergio',
  'Sofía',
  'Teresa',
  'Víctor',
] as const

const FAMILY_NAMES = [
  'Alonso',
  'Benítez',
  'Castro',
  'Delgado',
  'Fernández',
  'García',
  'Herrera',
  'Jiménez',
  'López',
  'Martínez',
  'Molina',
  'Navarro',
  'Ortega',
  'Pérez',
  'Ramírez',
  'Ríos',
  'Romero',
  'Ruiz',
  'Sánchez',
  'Vega',
] as const

function pickFromPool<T>(pool: readonly T[], rng: SeededRandom): T {
  const index = Math.floor(rng() * pool.length)
  return pool[index]!
}

function generateName(rng: SeededRandom): string {
  const first = pickFromPool(FIRST_NAMES, rng)
  const family = pickFromPool(FAMILY_NAMES, rng)
  return `${first} ${family}`
}

export { generateName }
