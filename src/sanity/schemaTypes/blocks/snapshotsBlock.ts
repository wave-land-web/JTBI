import { DashboardIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { hiddenField } from '../shared/hidden'
import { sectionIdField } from '../shared/sectionId'

export default defineType({
  name: 'snapshotsBlock',
  title: 'Snapshots',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    hiddenField,
    sectionIdField,
    defineField({
      name: 'heading',
      title: 'Section Heading',
      description: 'Heading displayed above the snapshots grid.',
      type: 'string',
      validation: (Rule) => Rule.required().error('A section heading is required.'),
    }),
    defineField({
      name: 'items',
      title: 'Snapshots',
      description: 'Drag to reorder. Select up to six snapshot documents to feature.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'snapshot' }],
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
        subtitle: 'Snapshots',
        media: DashboardIcon,
      }
    },
  },
})
