import type { SchemaTypeDefinition } from 'sanity'
import contactSubmission from './contactSubmission'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, contactSubmission],
}
