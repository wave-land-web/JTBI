/**
 * astro:env is only available in Astro server-side code.
 */

import { PUBLIC_SANITY_STUDIO_DATASET, PUBLIC_SANITY_STUDIO_PROJECT_ID } from 'astro:env/client'
import { SANITY_STUDIO_SECRET_TOKEN } from 'astro:env/server'
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  // This must match astro.config.mjs
  projectId: PUBLIC_SANITY_STUDIO_PROJECT_ID,
  dataset: PUBLIC_SANITY_STUDIO_DATASET || 'production',
  token: SANITY_STUDIO_SECRET_TOKEN,
  useCdn: false,
  apiVersion: '2025-01-28',
})

export default sanityClient
