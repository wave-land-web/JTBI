import { CloseIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  icon: CloseIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: '404',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      initialValue: 'The page you are looking for could not be found.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button Label',
      type: 'string',
      initialValue: 'Back to Site',
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button Link',
      type: 'string',
      initialValue: '/',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '404 Page',
        subtitle: 'Not Found',
      }
    },
  },
})
