import { ProjectsIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { COLOR_FIELD_DESCRIPTION, cssColorValidation } from './shared/cssColor'
import { hiddenField } from './shared/hidden'
import { richTextBlock } from './shared/richText'

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
      validation: (Rule) => Rule.required().error('A project title is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: { source: 'title' },
      validation: (Rule) => Rule.required().error('A URL slug is required.'),
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
      validation: (Rule) => Rule.required().min(1).error('Select at least one service.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'details',
      validation: (Rule) => Rule.required().error('A short description is required.'),
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
      description:
        'Image used for project cards on the homepage and related projects. Recommended: 1200x900 (4:3 landscape).',
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
      description: 'Flip the homepage card layout so the image appears on the left.',
      type: 'boolean',
      group: 'card',
      initialValue: false,
      hidden: ({ parent }) => !parent?.featured,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      description: 'Controls display order on the homepage (lower numbers appear first).',
      type: 'number',
      group: 'card',
      initialValue: 0,
      hidden: ({ parent }) => !parent?.featured,
    }),

    // ── Project Page ─────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      description:
        'Full-width hero image for the project page. Falls back to Card Image if not set. Recommended: 2400x1200 (2:1 landscape).',
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
      type: 'masonryGrid',
      group: 'page',
    }),
    defineField({
      name: 'sixUpGrid',
      title: 'Six-Up Grid',
      description:
        'Editorial 6-image grid displayed below the hero. Renders only when all 6 cells are filled.',
      type: 'sixUpGrid',
      group: 'page',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Main project/case study content.',
      type: 'array',
      group: 'page',
      of: [
        richTextBlock,
        defineArrayMember({ type: 'mediaCardRowBlock' }),
        defineArrayMember({ type: 'imageGalleryBlock' }),
      ],
    }),
    {
      ...hiddenField,
      name: 'hideRelatedProjects',
      title: 'Hide Related Projects Section',
      description:
        'If checked, the Related Projects section will be hidden on the project page but its content will be saved.',
      group: 'page',
    },
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
