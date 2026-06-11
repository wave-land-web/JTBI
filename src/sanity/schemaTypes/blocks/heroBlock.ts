import { StarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { hiddenField } from '../shared/hidden'
import { videoField } from '../shared/media'
import { sectionIdField } from '../shared/sectionId'

export default defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'styling', title: 'Styling' },
  ],
  fields: [
    { ...hiddenField, group: 'content' },
    { ...sectionIdField, group: 'content' },
    defineField({
      name: 'headline1',
      title: 'Heading Line 1',
      description: 'First line of the hero heading.',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().error('The first heading line is required.'),
    }),
    defineField({
      name: 'headline2',
      title: 'Heading Line 2',
      description: 'Second line of the hero heading.',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().error('The second heading line is required.'),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      description:
        'Full-width background image for the hero section. Used when no Carousel Images are set. Recommended: 2400x1200 (landscape, at least 1MB quality).',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) =>
        Array.isArray(parent?.carouselImages) && parent.carouselImages.length > 0,
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
    {
      ...videoField('backgroundVideo', 'Background Video'),
      description:
        'Optional ambient video for the hero background (plays muted on a loop). When set and finished processing, it replaces the Background Image. Used when no Carousel Images are set.',
      group: 'media',
      hidden: ({ parent }) =>
        Array.isArray(parent?.carouselImages) && parent.carouselImages.length > 0,
    },
    defineField({
      name: 'carouselImages',
      title: 'Carousel Images',
      description:
        'Optional set of images and videos that cycle in the hero with a crossfade effect. When provided, these replace the single background image. Recommended: 2400x1200 each, matching aspect ratio.',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: false },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: (Rule) =>
                Rule.required().error('Alt text is required for SEO and accessibility.'),
            }),
          ],
        },
        { type: 'videoItem' },
      ],
    }),
    defineField({
      name: 'headline1Color',
      title: 'Heading Line 1 Color',
      description: 'Choose "Dark" for primary text or "Light" for white text.',
      type: 'string',
      group: 'styling',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'headline2Color',
      title: 'Heading Line 2 Color',
      description: 'Choose "Dark" for primary text or "Light" for white text.',
      type: 'string',
      group: 'styling',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'light',
    }),
  ],
  preview: {
    select: { line1: 'headline1', line2: 'headline2', media: 'backgroundImage' },
    prepare({ line1, line2, media }) {
      return {
        title: line1 || 'Untitled Hero',
        subtitle: line2 ? `Hero · ${line2}` : 'Hero',
        media: media || StarIcon,
      }
    },
  },
})
