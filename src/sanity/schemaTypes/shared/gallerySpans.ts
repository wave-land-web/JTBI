import { defineField, type Path } from 'sanity'

/**
 * Shared `colSpan`/`rowSpan` fields for Image Gallery items (images and
 * videos). Both member types are direct items of the gallery's `images`
 * array, so the colSpan validation's path arithmetic works identically.
 */

/**
 * Walks `path` from the `document` root and returns whatever value sits there,
 * resolving array `_key` references along the way. Used by per-item validators
 * to read sibling fields on the parent gallery block.
 */
export function getAtPath(document: unknown, path: Path): unknown {
  return path.reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    if (typeof key === 'string' || typeof key === 'number') {
      return (acc as Record<string | number, unknown>)[key]
    }
    if (Array.isArray(acc) && typeof key === 'object' && '_key' in key) {
      return acc.find(
        (item) =>
          item != null &&
          typeof item === 'object' &&
          (item as { _key?: string })._key === (key as { _key: string })._key,
      )
    }
    return undefined
  }, document)
}

export const colSpanField = defineField({
  name: 'colSpan',
  title: 'Column span',
  description:
    "How many columns this item spans on desktop. Mobile spans up to 2 columns. Spans larger than the gallery's column count clamp automatically.",
  type: 'number',
  initialValue: 1,
  options: {
    list: [
      { title: '1', value: 1 },
      { title: '2', value: 2 },
      { title: '3', value: 3 },
      { title: '4', value: 4 },
      { title: '5', value: 5 },
      { title: '6', value: 6 },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  validation: (Rule) => [
    Rule.min(1).max(6),
    Rule.custom((value, context) => {
      if (typeof value !== 'number') return true
      // Path: [..., {_key}, 'images', {_key}, 'colSpan']
      // Drop last 3 segments to land on the gallery block.
      const blockPath = (context.path ?? []).slice(0, -3)
      const block = getAtPath(context.document, blockPath) as { columns?: number } | undefined
      const cols = block?.columns
      if (typeof cols === 'number' && value > cols) {
        return `Span ${value} exceeds the gallery's ${cols} columns — it will display as ${cols}.`
      }
      return true
    }).warning(),
  ],
})

export const rowSpanField = defineField({
  name: 'rowSpan',
  title: 'Row span',
  description:
    'How many rows this item spans. Combine with column span to control cell aspect (e.g. 2×1 = wide, 1×2 = tall, 2×2 = bigger square).',
  type: 'number',
  initialValue: 1,
  options: {
    list: [
      { title: '1', value: 1 },
      { title: '2', value: 2 },
      { title: '3', value: 3 },
      { title: '4', value: 4 },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  validation: (Rule) => Rule.min(1).max(4),
})
