import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description:
        'Optional HTML id for anchor links (e.g. "contact"). No spaces or special characters.',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'subheadingAccent',
      title: 'Subheading Accent',
      description: 'Lighter-weight text appended to the subheading (e.g. "Let\'s chat.")',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled',
        subtitle: 'Contact',
        media: EnvelopeIcon,
      }
    },
  },
})
