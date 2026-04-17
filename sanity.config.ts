import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { filterSingletonActions, SINGLETON_TYPES } from './src/sanity/lib/singletonActions'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  projectId: 'vs47sslu',
  dataset: 'production',
  title: 'JTBI Content',
  plugins: [structureTool({ structure })],
  schema,
  name: 'JTBI',
  document: {
    // Remove "duplicate" and "delete" actions for singleton documents
    actions: (prev, context) => filterSingletonActions(prev, context),
    // Hide "create new" from the global + menu for singleton types
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => !SINGLETON_TYPES.has(template.templateId))
      }
      return prev
    },
  },
})
