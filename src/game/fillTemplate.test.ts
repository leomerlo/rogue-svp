import { describe, expect, it } from 'vitest'
import { fillTemplate } from '@/game/fillTemplate'
import type { TemplateContext } from '@/game/fillTemplate'

const BASE_CONTEXT: TemplateContext = {
  char: { name: 'Elena', family: 'García', archetype: 'El Snob', weakness: 'teme al silencio' },
  roles: { BRIDE: 'Sofía', HOST: 'Manuel' },
}

describe('fillTemplate', () => {
  it('replaces [CHAR.name]', () => {
    expect(fillTemplate('[CHAR.name] llega tarde.', BASE_CONTEXT)).toBe('Elena llega tarde.')
  })

  it('replaces [CHAR.family]', () => {
    expect(fillTemplate('Los [CHAR.family] nunca olvidan.', BASE_CONTEXT)).toBe('Los García nunca olvidan.')
  })

  it('replaces [CHAR.archetype]', () => {
    expect(fillTemplate('Perfil: [CHAR.archetype].', BASE_CONTEXT)).toBe('Perfil: El Snob.')
  })

  it('replaces [CHAR.weakness]', () => {
    expect(fillTemplate('Su talón: [CHAR.weakness].', BASE_CONTEXT)).toBe('Su talón: teme al silencio.')
  })

  it('replaces [BRIDE.name]', () => {
    expect(fillTemplate('[BRIDE.name] entra al salón.', BASE_CONTEXT)).toBe('Sofía entra al salón.')
  })

  it('replaces [HOST.name]', () => {
    expect(fillTemplate('[HOST.name] recibe a los invitados.', BASE_CONTEXT)).toBe('Manuel recibe a los invitados.')
  })

  it('replaces multiple slots in one template', () => {
    expect(fillTemplate('[CHAR.name] [CHAR.family] mira a [BRIDE.name].', BASE_CONTEXT))
      .toBe('Elena García mira a Sofía.')
  })

  it('passes through unknown slots unchanged', () => {
    expect(fillTemplate('[UNKNOWN.slot] aparece.', BASE_CONTEXT)).toBe('[UNKNOWN.slot] aparece.')
  })

  it('passes through role slots with non-name subkey unchanged', () => {
    expect(fillTemplate('[BRIDE.family] desconocida.', BASE_CONTEXT)).toBe('[BRIDE.family] desconocida.')
  })

  it('passes through slots with missing optional fields', () => {
    const ctx: TemplateContext = { char: { name: 'Ana', family: 'López' } }
    expect(fillTemplate('[CHAR.archetype] no definido.', ctx)).toBe('[CHAR.archetype] no definido.')
    expect(fillTemplate('[CHAR.weakness] no definido.', ctx)).toBe('[CHAR.weakness] no definido.')
  })

  it('passes through role slots when roles is undefined', () => {
    const ctx: TemplateContext = { char: { name: 'Ana', family: 'López' } }
    expect(fillTemplate('[BRIDE.name] desconocida.', ctx)).toBe('[BRIDE.name] desconocida.')
  })

  it('returns empty string unchanged', () => {
    expect(fillTemplate('', BASE_CONTEXT)).toBe('')
  })

  it('returns template with no slots unchanged', () => {
    const tmpl = 'Sin slots aquí.'
    expect(fillTemplate(tmpl, BASE_CONTEXT)).toBe(tmpl)
  })
})
