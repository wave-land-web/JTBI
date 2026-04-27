import { ComposeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { COLOR_FIELD_DESCRIPTION, cssColorValidation } from '../shared/cssColor'
import { hiddenField } from '../shared/hidden'
import { richTextBlock } from '../shared/richText'
import { sectionIdField } from '../shared/sectionId'

export default defineType({
  name: 'mediaCardRowBlock',
  title: 'Media Card Row',
  type: 'object',
  icon: ComposeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'link', title: 'Link' },
    { name: 'styling', title: 'Styling' },
  ],
  fields: [
    { ...hiddenField, group: 'content' },
    { ...sectionIdField, group: 'content' },
    defineField({
      name: 'heading',
      title: 'Section Heading',
      description: 'Optional heading displayed above the card.',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'featureText',
      title: 'Feature Text',
      description: 'Rich text displayed alongside the card.',
      type: 'array',
      group: 'content',
      of: [richTextBlock],
      validation: (Rule) => Rule.required().error('Feature text is required.'),
    }),
    defineField({
      name: 'title',
      title: 'Card Title',
      description: 'Primary heading inside the card.',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().error('A card title is required.'),
    }),
    defineField({
      name: 'description',
      title: 'Card Description',
      description: 'Short paragraph displayed inside the card body.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required().error('A card description is required.'),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description:
        'Image displayed next to the card content. Recommended: 1200x900 (4:3 landscape).',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) =>
            Rule.required().error('Alt text is required for SEO and accessibility.'),
        }),
      ],
    }),
    defineField({
      name: 'href',
      title: 'Link',
      description: 'Optional link for the card CTA. Supports relative paths or full URLs.',
      type: 'string',
      group: 'link',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      description: 'Button text for the link (e.g. "Read More", "Learn More").',
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
      name: 'reversed',
      title: 'Reversed Layout',
      description: 'Flip the card layout so the image appears on the left.',
      type: 'boolean',
      group: 'styling',
      initialValue: false,
    }),
    defineField({
      name: 'styling',
      title: 'Colors',
      description: COLOR_FIELD_DESCRIPTION,
      type: 'object',
      group: 'styling',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'accentColor',
          title: 'Accent Color',
          description: 'Top border accent color.',
          type: 'string',
          validation: cssColorValidation,
        }),
        defineField({
          name: 'cardBackgroundColor',
          title: 'Card Background Color',
          description: 'Background color of the card.',
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
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'image' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `Media Card Row · ${subtitle}` : 'Media Card Row',
        media: media || ComposeIcon,
      }
    },
  },
})
