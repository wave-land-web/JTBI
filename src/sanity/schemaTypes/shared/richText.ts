import { defineArrayMember } from 'sanity'

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
})
