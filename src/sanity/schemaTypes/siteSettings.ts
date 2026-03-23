import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      description: 'Controls the banner displayed below the main navigation.',
      type: 'object',
      options: {
        collapsible: false,
      },
      initialValue: {
        active: false,
      },
      fields: [
        defineField({
          name: 'active',
          title: 'Show announcement bar',
          description: 'Turn this on when the banner should appear on the site.',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'label',
          title: 'Label',
          description: 'Short lead-in text such as “New” or “Important update”.',
          type: 'string',
        }),
        defineField({
          name: 'message',
          title: 'Message',
          description: 'Main banner copy shown to visitors.',
          type: 'text',
          rows: 3,
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as { active?: boolean } | undefined

              if (parent?.active && !value?.trim()) {
                return 'Add a message before turning the announcement bar on.'
              }

              return true
            }),
        }),
        defineField({
          name: 'linkText',
          title: 'Link text',
          description: 'Optional call to action, for example “Learn more”.',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as { href?: string } | undefined

              if (parent?.href && !value?.trim()) {
                return 'Add link text or remove the link target.'
              }

              return true
            }),
        }),
        defineField({
          name: 'href',
          title: 'Link destination',
          description: 'Supports relative links and anchors such as /contact or /#contact.',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as { linkText?: string } | undefined

              if (parent?.linkText && !value?.trim()) {
                return 'Add a link destination or remove the link text.'
              }

              return true
            }),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global content and presentation controls',
      }
    },
  },
})