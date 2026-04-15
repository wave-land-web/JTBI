import { DashboardIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: DashboardIcon,
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) =>
            Rule.required().error('Alt text is important for SEO and accessibility'),
        }),
      ],
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
      name: 'styling',
      title: 'Styling',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
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
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'image' },
  },
})
