import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { richTextBlock } from './shared/richText'

export default defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Page title (e.g. "Privacy Policy", "Terms of Service").',
      type: 'string',
      validation: (rule) => rule.required().error('A page title is required.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL path for this page (e.g. /legal/privacy).',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required().error('A URL slug is required.'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Main legal content rendered on the page.',
      type: 'array',
      of: [richTextBlock],
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      description: 'Meta description shown in search results and social shares.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title: title || 'Untitled',
        subtitle: slug ? `/legal/${slug}` : 'No slug',
      }
    },
  },
})
