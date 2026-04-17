import { DashboardIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { COLOR_FIELD_DESCRIPTION, cssColorValidation } from './shared/cssColor'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: DashboardIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'link', title: 'Link' },
    { name: 'styling', title: 'Styling' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Name of the service (used in cards and navigation).',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().error('A service title is required.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Short summary shown on the services section card.',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (Rule) => Rule.required().error('A short description is required.'),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Image used on the service card. Recommended: 800×800 (1:1 square).',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) =>
            Rule.required().error('Alt text is required for SEO and accessibility.'),
        }),
      ],
    }),
    defineField({
      name: 'href',
      title: 'Link',
      description: 'Optional link destination for the service card. Supports relative paths.',
      type: 'string',
      group: 'link',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      description: 'Button text for the link (e.g. "Learn More").',
      type: 'string',
      group: 'link',
      hidden: ({ parent }) => !parent?.href,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { href?: string } | undefined
          if (parent?.href && !value?.trim()) return 'Add button text or remove the link.'
          return true
        }),
    }),
    defineField({
      name: 'styling',
      title: 'Styling',
      description: COLOR_FIELD_DESCRIPTION,
      type: 'object',
      group: 'styling',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'accentColor',
          title: 'Accent Color',
          description: 'Accent border color.',
          type: 'string',
          validation: cssColorValidation,
        }),
        defineField({
          name: 'mediaBackgroundColor',
          title: 'Media Background Color',
          description: 'Background color behind the image.',
          type: 'string',
          validation: cssColorValidation,
        }),
        defineField({
          name: 'cardBackgroundColor',
          title: 'Card Background Color',
          description: 'Background color of the card content area.',
          type: 'string',
          validation: cssColorValidation,
        }),
        defineField({
          name: 'cardTextColor',
          title: 'Card Text Color',
          description: 'Text color inside the card.',
          type: 'string',
          validation: cssColorValidation,
        }),
        defineField({
          name: 'titleColor',
          title: 'Title Color',
          description: 'Color of the service title.',
          type: 'string',
          validation: cssColorValidation,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'image' },
  },
})
