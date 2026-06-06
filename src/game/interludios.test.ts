import { describe, expect, it } from 'vitest'
import { INTERLUDIO_TEMPLATES } from '@/game/interludios'
import { fillTemplate } from '@/game/fillTemplate'

describe('INTERLUDIO_TEMPLATES', () => {
  it('exports at least 6 templates', () => {
    expect(INTERLUDIO_TEMPLATES.length).toBeGreaterThanOrEqual(6)
  })

  it('each template has at least 3 lines', () => {
    for (const template of INTERLUDIO_TEMPLATES) {
      const lines = template.split('\n').filter((l) => l.trim().length > 0)
      expect(lines.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('all templates are non-empty strings', () => {
    for (const template of INTERLUDIO_TEMPLATES) {
      expect(typeof template).toBe('string')
      expect(template.trim().length).toBeGreaterThan(0)
    }
  })

  it('all slots in templates are supported by fillTemplate', () => {
    const context = {
      char: { name: 'Elena Vidal', family: 'Vidal', archetype: 'El Snob', weakness: 'la deuda' },
    }
    for (const template of INTERLUDIO_TEMPLATES) {
      const filled = fillTemplate(template, context)
      // No unresolved slots should remain for known keys
      expect(filled).not.toMatch(/\[CHAR\.(name|family|archetype|weakness)\]/)
    }
  })
})
