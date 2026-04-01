import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      description: 'Add and reorder sections to compose the page.',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'projectsBlock' }),
        defineArrayMember({ type: 'mediaCardRowBlock' }),
        defineArrayMember({ type: 'servicesBlock' }),
        defineArrayMember({ type: 'contactBlock' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Page Builder',
      }
    },
  },
})
