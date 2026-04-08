import { BlockContentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description:
        'Optional HTML id for anchor links (e.g. "hero"). No spaces or special characters.',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      description: 'Full-width background image for the hero section.',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'headline1',
      title: 'Heading Line 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline1Color',
      title: 'Heading Line 1 Color',
      description: 'Choose "dark" for primary text or "light" for white text.',
      type: 'string',
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
      name: 'headline2',
      title: 'Heading Line 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline2Color',
      title: 'Heading Line 2 Color',
      description: 'Choose "dark" for primary text or "light" for white text.',
      type: 'string',
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
        subtitle: line2 || 'Hero',
        media: media || BlockContentIcon,
      }
    },
  },
})
