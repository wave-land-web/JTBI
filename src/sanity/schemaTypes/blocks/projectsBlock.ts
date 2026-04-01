import { InlineElementIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'projectsBlock',
  title: 'Featured Projects',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description:
        'Optional HTML id for anchor links (e.g. "portfolio"). No spaces or special characters.',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      description: 'Drag to reorder. Each references an existing Project document.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled',
        subtitle: 'Featured Projects',
        media: InlineElementIcon,
      }
    },
  },
})
