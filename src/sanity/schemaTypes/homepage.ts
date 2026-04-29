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
      title: 'Sections',
      description:
        'Add and reorder sections to compose the homepage. Each section renders in the order listed here.',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'projectsBlock' }),
        defineArrayMember({ type: 'mediaCardRowBlock' }),
        defineArrayMember({ type: 'snapshotsBlock' }),
        defineArrayMember({ type: 'contactBlock' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Page Sections',
      }
    },
  },
})
