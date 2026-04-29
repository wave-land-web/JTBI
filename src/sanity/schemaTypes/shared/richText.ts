import { defineArrayMember, defineField } from 'sanity'

/**
 * Shared rich text (Portable Text) block configuration.
 * Use this wherever a rich text editor is needed so
 * customizations apply consistently across the CMS.
 */
export const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'H4', value: 'h4' },
    { title: 'H5', value: 'h5' },
    { title: 'H6', value: 'h6' },
    { title: 'Quote', value: 'blockquote' },
    { title: 'Code', value: 'code' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
      { title: 'Underline', value: 'underline' },
      { title: 'Strike', value: 'strike-through' },
      { title: 'Code', value: 'code' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            description: 'Accepts absolute URLs, mailto:, tel:, and relative paths (e.g. /about).',
            validation: (Rule) =>
              Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel'],
                allowRelative: true,
              }),
          }),
          defineField({
            name: 'blank',
            title: 'Open in new tab',
            type: 'boolean',
            initialValue: false,
          }),
        ],
      },
    ],
  },
})
