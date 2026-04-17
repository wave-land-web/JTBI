import { InlineElementIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { sectionIdField } from '../shared/sectionId'

export default defineType({
  name: 'projectsBlock',
  title: 'Featured Projects',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    sectionIdField,
    defineField({
      name: 'heading',
      title: 'Section Heading',
      description: 'Heading displayed above the list of projects.',
      type: 'string',
      validation: (Rule) => Rule.required().error('A section heading is required.'),
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
