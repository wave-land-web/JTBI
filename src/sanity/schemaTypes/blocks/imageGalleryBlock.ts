import { ImagesIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'imageGalleryBlock',
  title: 'Image Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
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
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(30).error('Add 1–30 images.'),
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
