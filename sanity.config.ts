import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { filterSingletonActions, SINGLETON_TYPES } from './src/sanity/lib/singletonActions'
import { resolve } from './src/sanity/presentation/resolve'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// In dev this is the local Astro server; in production it should be the
// deployed site (set via SANITY_STUDIO_PREVIEW_URL when deploying the Studio,
// or hard-code in the build that ships to /admin).
const previewOrigin =
  (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PREVIEW_URL) ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321')

export default defineConfig({
  projectId: 'vs47sslu',
  dataset: 'production',
  title: 'JTBI Content',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        initial: previewOrigin,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
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
