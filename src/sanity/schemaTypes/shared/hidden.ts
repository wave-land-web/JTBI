import { defineField } from 'sanity'

/**
 * Shared `hidden` field for toggling visibility of sections/blocks in Sanity.
 * If true, the section/block will be hidden on the frontend but content is preserved.
 */
export const hiddenField = defineField({
  name: 'hidden',
  title: 'Hide Section',
  description: 'If checked, this section will be hidden on the site but its content will be saved.',
  type: 'boolean',
  initialValue: false,
})
