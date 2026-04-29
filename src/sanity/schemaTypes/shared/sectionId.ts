import { defineField } from 'sanity'

/**
 * Shared `sectionId` field used across page builder blocks.
 * Validates kebab-case (lowercase letters, numbers, and hyphens only).
 */
export const sectionIdField = defineField({
  name: 'sectionId',
  title: 'Section ID',
  description:
    'Optional HTML id for anchor links (e.g. "hero"). Lowercase letters, numbers, and hyphens only.',
  type: 'string',
  validation: (Rule) =>
    Rule.regex(/^[a-z0-9-]+$/, {
      name: 'section id',
      invert: false,
    }).error('Use lowercase letters, numbers, and hyphens only (no spaces or special characters).'),
})
