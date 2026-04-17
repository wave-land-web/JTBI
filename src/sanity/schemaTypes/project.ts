import { ProjectsIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { richTextBlock } from './shared/richText'
import { COLOR_FIELD_DESCRIPTION, cssColorValidation } from './shared/cssColor'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'card', title: 'Card & Listing' },
    { name: 'page', title: 'Project Page' },
    { name: 'styling', title: 'Styling' },
  ],
  fields: [
    // ── Details ──────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'details',
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
      group: 'details',
      validation: (Rule) => Rule.required(),
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
          description: 'Top border accent color.',
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
      ],
    }),

    // ── Card & Listing ───────────────────────────────
    defineField({
      name: 'cardImage',
      title: 'Card Image',
      description: 'Image used for project cards on the homepage and related projects.',
      type: 'image',
      group: 'card',
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
      name: 'featureText',
      title: 'Feature Text',
      description: 'Supplementary context for project — used as a caption on the homepage card.',
      type: 'array',
      group: 'card',
      of: [richTextBlock],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      description: 'Button text for the link (e.g. "Read More", "Learn More")',
      type: 'string',
      group: 'card',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Featured projects appear on the homepage.',
      type: 'boolean',
      group: 'card',
      initialValue: false,
    }),
    defineField({
      name: 'reversed',
      title: 'Reversed Layout',
      description: 'Flip the card layout so the image appears on the left.',
      type: 'boolean',
      group: 'card',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Controls display order on the homepage (lower numbers appear first).',
      type: 'number',
      group: 'card',
      initialValue: 0,
    }),

    // ── Project Page ─────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      description:
        'Full-width hero image for the project page. Falls back to Card Image if not set.',
      type: 'image',
      group: 'page',
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
      name: 'projectOverview',
      title: 'Project Overview',
      description: 'Summary shown before the main body content on the project page.',
      type: 'array',
      group: 'page',
      of: [richTextBlock],
    }),
    defineField({
      name: 'masonryGrid',
      title: 'Masonry Grid',
      description: 'Gallery of images displayed in a full-width masonry grid below the hero.',
      type: 'array',
      group: 'page',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required().error('Alt text is required for accessibility'),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(20),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Main project/case study content.',
      type: 'array',
      group: 'page',
      of: [richTextBlock, defineArrayMember({ type: 'mediaCardRowBlock' })],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      description:
        'Manually pick related projects. If empty, projects with overlapping services are shown automatically.',
      type: 'array',
      group: 'page',
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
      media: 'cardImage',
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
