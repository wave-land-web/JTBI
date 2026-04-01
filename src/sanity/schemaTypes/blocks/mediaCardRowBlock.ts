import { ComposeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mediaCardRowBlock',
  title: 'Media Card Row',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description:
        'Optional HTML id for anchor links (e.g. "about"). No spaces or special characters.',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      description: 'Optional heading displayed above the card.',
      type: 'string',
    }),
    defineField({
      name: 'featureText',
      title: 'Feature Text',
      description: 'Rich text displayed alongside the card.',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      type: 'text',
      rows: 3,
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
          title: 'Alt Text',
          type: 'string',
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
      name: 'reversed',
      title: 'Reversed Layout',
      description: 'Flip the card layout so the image appears on the left.',
      type: 'boolean',
      initialValue: false,
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
          name: 'cardBackgroundColor',
          title: 'Card Background Color',
          type: 'string',
        }),
        defineField({
          name: 'cardTextColor',
          title: 'Card Text Color',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled',
        subtitle: 'Media Card Row',
        media: ComposeIcon,
      }
    },
  },
})
