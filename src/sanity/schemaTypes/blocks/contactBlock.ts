import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { sectionIdField } from '../shared/sectionId'

export default defineType({
  name: 'contactBlock',
  title: 'Contact',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    sectionIdField,
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'Primary heading for the contact section.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      description: 'Smaller heading displayed above the form.',
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
      description: 'Short paragraph displayed above the contact form.',
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
