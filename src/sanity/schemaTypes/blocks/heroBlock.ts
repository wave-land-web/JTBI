import { BlockContentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description:
        'Optional HTML id for anchor links (e.g. "hero"). No spaces or special characters.',
      type: 'string',
    }),
    defineField({
      name: 'headingLine1',
      title: 'Heading Line 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingLine2',
      title: 'Heading Line 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { line1: 'headingLine1', line2: 'headingLine2' },
    prepare({ line1, line2 }) {
      return {
        title: line1 || 'Untitled Hero',
        subtitle: line2 || 'Hero',
        media: BlockContentIcon,
      }
    },
  },
})
