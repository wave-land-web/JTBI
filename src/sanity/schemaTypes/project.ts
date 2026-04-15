import { ProjectsIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTextBlock } from './shared/richText'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'service' }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featureText',
      title: 'Feature Text',
      description:
        'Supplementary context for project - can be used in various ways across the site (e.g. as a caption on the homepage card).',
      type: 'array',
      of: [richTextBlock],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      description: 'Button text for the link (e.g. "Read More", "Learn More")',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Featured projects appear on the homepage.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'reversed',
      title: 'Reversed Layout',
      description: 'Flip the card layout so the image appears on the left.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Controls display order on the homepage (lower numbers appear first).',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'styling',
      title: 'Styling',
      description: 'Optional color overrides for this project card.',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'accentColor',
          title: 'Accent Color',
          description: 'Top border color (hex value, e.g. #d94b43)',
          type: 'string',
        }),
        defineField({
          name: 'cardBackgroundColor',
          title: 'Card Background Color',
          description: 'Background color of the card content area',
          type: 'string',
        }),
        defineField({
          name: 'cardTextColor',
          title: 'Card Text Color',
          description: 'Text color inside the card content area',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'projectOverview',
      title: 'Project Overview',
      description: 'Optional summary shown before the main body content on the project page.',
      type: 'array',
      of: [richTextBlock],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Main project/case study content.',
      type: 'array',
      of: [richTextBlock],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      description:
        'Manually pick related projects. If empty, 3 projects with overlapping services are shown automatically.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      featured: 'featured',
      media: 'image',
    },
    prepare({ title, subtitle, featured, media }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle,
        media,
      }
    },
  },
})
