import { DashboardIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { hiddenField } from '../shared/hidden'
import { sectionIdField } from '../shared/sectionId'

export default defineType({
  name: 'servicesBlock',
  title: 'Services',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    hiddenField,
    sectionIdField,
    defineField({
      name: 'heading',
      title: 'Section Heading',
      description: 'Heading displayed above the services grid.',
      type: 'string',
      validation: (Rule) => Rule.required().error('A section heading is required.'),
    }),
    defineField({
      name: 'items',
      title: 'Services',
      description: 'Drag to reorder. Select up to six service documents to feature.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'service' }],
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled',
        subtitle: 'Services',
        media: DashboardIcon,
      }
    },
  },
})
