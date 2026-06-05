interface TemplateContext {
  char: {
    name: string
    family: string
    archetype?: string
    weakness?: string
  }
  /** Keys must be UPPERCASE to match the slot syntax, e.g. `{ BRIDE: 'Sofia' }` for `[BRIDE.name]`. */
  roles?: Record<string, string>
}

/**
 * Replaces `[KEY.subkey]` slots in template using context values.
 * KEY must be uppercase (e.g. CHAR, BRIDE); subkey must be lowercase (e.g. name, family).
 * Unresolved slots (unknown key, missing optional field) are left as-is.
 */
function fillTemplate(template: string, context: TemplateContext): string {
  return template.replace(/\[([A-Z]+)\.([a-z]+)\]/g, (match, key: string, subkey: string) => {
    if (key === 'CHAR') {
      const val = context.char[subkey as keyof TemplateContext['char']]
      return val ?? match
    }
    if (subkey === 'name' && context.roles?.[key] !== undefined) {
      return context.roles[key]!
    }
    return match
  })
}

export { fillTemplate }
export type { TemplateContext }
