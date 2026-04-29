import { ImagesIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType, type Path } from 'sanity'
import { hiddenField } from '../shared/hidden'

/**
 * Walks `path` from the `document` root and returns whatever value sits there,
 * resolving array `_key` references along the way. Used by per-image validators
 * to read sibling fields on the parent gallery block.
 */
function getAtPath(document: unknown, path: Path): unknown {
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

export default defineType({
  name: 'imageGalleryBlock',
  title: 'Image Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    hiddenField,
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'Upload images for the full-width gallery. Square or landscape images work best. Recommended: min 1200px on the long edge.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
            }),
            defineField({
              name: 'colSpan',
              title: 'Column span',
              description:
                "How many columns this image spans on desktop. Mobile spans up to 2 columns. Spans larger than the gallery's column count clamp automatically.",
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
                  const block = getAtPath(context.document, blockPath) as
                    | { columns?: number }
                    | undefined
                  const cols = block?.columns
                  if (typeof cols === 'number' && value > cols) {
                    return `Span ${value} exceeds the gallery's ${cols} columns — it will display as ${cols}.`
                  }
                  return true
                }).warning(),
              ],
            }),
            defineField({
              name: 'rowSpan',
              title: 'Row span',
              description:
                'How many rows this image spans. Combine with column span to control cell aspect (e.g. 2×1 = wide, 1×2 = tall, 2×2 = bigger square).',
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
            }),
          ],
          preview: {
            select: {
              alt: 'alt',
              colSpan: 'colSpan',
              rowSpan: 'rowSpan',
              media: 'asset',
            },
            prepare({ alt, colSpan, rowSpan, media }) {
              const c = Number(colSpan ?? 1)
              const r = Number(rowSpan ?? 1)
              const label = alt || 'Image'
              const featured = c > 1 || r > 1
              return {
                title: featured ? `${label} · ${c}×${r}` : label,
                media,
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(30).error('Add 1-30 images.'),
    }),
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      description: 'Number of columns on desktop. Mobile is always 2 columns.',
      type: 'number',
      initialValue: 5,
      options: {
        list: [
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '5', value: 5 },
          { title: '6', value: 6 },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required().min(2).max(6),
    }),
    defineField({
      name: 'fullWidth',
      title: 'Full-bleed',
      description: 'Let the gallery span the full viewport width (ignores page padding).',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      images: 'images',
      columns: 'columns',
      media: 'images.0',
    },
    prepare({ images, columns, media }) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: `Image Gallery (${count} image${count === 1 ? '' : 's'})`,
        subtitle: `${columns ?? 5} columns`,
        media,
      }
    },
  },
})
