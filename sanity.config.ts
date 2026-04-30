import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { filterSingletonActions, SINGLETON_TYPES } from './src/sanity/lib/singletonActions'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// PREVIEW DISABLED: presentationTool + resolve still live in src/sanity/presentation
// and are ready to re-enable. To turn preview back on, restore the imports +
// plugin entry below. See NOTES.md → "Sanity preview / visual editing".
//
// import { presentationTool } from 'sanity/presentation'
// import { resolve } from './src/sanity/presentation/resolve'
// const previewOrigin =
//   (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_URL) ||
//   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321')

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
