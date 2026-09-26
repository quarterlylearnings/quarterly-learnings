/** Id of a relationship value, whether it is stored as an id or populated as a doc. */
export function relationId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return String(value)
}
