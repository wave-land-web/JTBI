import { DashboardIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import {
  EXCLUSIVE_GRIDS_MESSAGE,
  isMasonryGridFilled,
  isSixUpGridFilled,
} from '../shared/gridFilled'
import { hiddenField } from '../shared/hidden'

export default defineType({
  name: 'masonryGrid',
  title: 'Masonry Grid',
  type: 'object',
  icon: DashboardIcon,
  description:
    'Gallery of images and videos displayed in a full-width masonry grid below the hero. Mix of portrait and landscape works best. Recommended: min 1200px on the long edge.',
  validation: (Rule) =>
    Rule.custom((value, context) => {
      const doc = context.document as { sixUpGrid?: unknown } | undefined
      if (!doc) return true
      if (isMasonryGridFilled(value) && isSixUpGridFilled(doc.sixUpGrid)) {
        return EXCLUSIVE_GRIDS_MESSAGE
      }
      return true
    }),
  fields: [
    hiddenField,
    defineField({
      name: 'images',
      title: 'Images & Videos',
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
          ],
        }),
        defineArrayMember({ type: 'videoItem' }),
      ],
      validation: (Rule) => Rule.max(20),
    }),
  ],
  preview: {
    select: {
      images: 'images',
      media: 'images.0',
    },
    prepare({ images, media }) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: 'Masonry Grid',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
        media,
      }
    },
  },
})
