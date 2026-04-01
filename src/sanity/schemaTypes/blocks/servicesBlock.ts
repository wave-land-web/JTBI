import { DashboardIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesBlock',
  title: 'Services',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description:
        'Optional HTML id for anchor links (e.g. "services"). No spaces or special characters.',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Label',
              type: 'string',
            }),
            defineField({
              name: 'accentColor',
              title: 'Accent Color',
              type: 'string',
            }),
            defineField({
              name: 'mediaBackgroundColor',
              title: 'Media Background Color',
              type: 'string',
            }),
            defineField({
              name: 'cardBackgroundColor',
              title: 'Card Background Color',
              type: 'string',
            }),
            defineField({
              name: 'cardTextColor',
              title: 'Card Text Color',
              type: 'string',
            }),
            defineField({
              name: 'titleColor',
              title: 'Title Color',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
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
