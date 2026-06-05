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
  'Aguirre',
  'Arroyo',
  'Blanco',
  'Cabrera',
  'Cano',
  'Cortés',
  'Cruz',
  'Díaz',
  'Domínguez',
  'Flores',
] as const

function pickFromPool<T>(pool: readonly T[], rng: SeededRandom): T {
  const index = Math.floor(rng() * pool.length)
  return pool[index]!
}

function generateFullName(rng: SeededRandom): { firstName: string; familyName: string } {
  const firstName = pickFromPool(FIRST_NAMES, rng)
  const familyName = pickFromPool(FAMILY_NAMES, rng)
  return { firstName, familyName }
}

function generateName(rng: SeededRandom): string {
  const { firstName, familyName } = generateFullName(rng)
  return `${firstName} ${familyName}`
}

export { generateFullName, generateName }
