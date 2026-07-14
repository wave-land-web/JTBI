import { ThLargeIcon } from '@sanity/icons'
import { defineType } from 'sanity'
import {
  EXCLUSIVE_GRIDS_MESSAGE,
  isMasonryGridFilled,
  isSixUpGridFilled,
} from '../shared/gridFilled'
import { hiddenField } from '../shared/hidden'
import { mediaCellFields } from '../shared/media'

export default defineType({
  name: 'sixUpGrid',
  title: 'Six-Up Grid',
  type: 'object',
  icon: ThLargeIcon,
  description:
    'Editorial 6-cell grid: one wide cell, one tall center cell, and four squares. Each cell takes an image or a video. All 6 cells must be filled for the grid to render.',
  validation: (Rule) =>
    Rule.custom((value, context) => {
      const doc = context.document as { masonryGrid?: unknown } | undefined
      if (!doc) return true
      if (isSixUpGridFilled(value) && isMasonryGridFilled(doc.masonryGrid)) {
        return EXCLUSIVE_GRIDS_MESSAGE
      }
      return true
    }),
  fields: [
    hiddenField,
    ...mediaCellFields(
      'topWide',
      '1. Top wide',
      'Top-left wide cell. Recommended ratio 2:1 landscape (e.g. 1600×800).',
    ),
    ...mediaCellFields(
      'centerTall',
      '2. Center tall',
      'Center cell, spans both rows. Recommended ratio 1:1 to slight portrait (e.g. 1200×1200 or 1000×1100).',
    ),
    ...mediaCellFields(
      'topRight',
      '3. Top right',
      'Top-right square. Recommended ratio 1:1 (e.g. 800×800).',
    ),
    ...mediaCellFields(
      'bottomLeft',
      '4. Bottom left',
      'Bottom row, leftmost square. Recommended ratio 1:1 (e.g. 800×800).',
    ),
    ...mediaCellFields(
      'bottomMidLeft',
      '5. Bottom mid-left',
      'Bottom row, second-from-left square. Recommended ratio 1:1 (e.g. 800×800).',
    ),
    ...mediaCellFields(
      'bottomRight',
      '6. Bottom right',
      'Bottom-right square. Recommended ratio 1:1 (e.g. 800×800).',
    ),
  ],
  preview: {
    select: {
      media: 'centerTall',
      topWide: 'topWide',
    },
    prepare({ media, topWide }) {
      return {
        title: 'Six-Up Grid',
        subtitle: 'Editorial 6-image layout',
        media: media || topWide,
      }
    },
  },
})
