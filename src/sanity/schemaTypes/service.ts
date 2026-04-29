import { DashboardIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: DashboardIcon,
  description:
    'A service offered by JTB Imaginative. Used as a tag on projects so the related-projects section can match by overlap.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Name of the service (e.g. "Brand Identity", "Web Design").',
      type: 'string',
      validation: (Rule) => Rule.required().error('A service title is required.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Optional internal description of this service.',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
