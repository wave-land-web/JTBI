// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sanity from '@sanity/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // TODO: replace with prod site URL
  site: 'http://localhost:4321',
  env: {
    schema: {
      PUBLIC_SANITY_STUDIO_PROJECT_ID: envField.string({
        context: 'client',
        access: 'public',
        default: 'vs47sslu',
      }),
      PUBLIC_SANITY_STUDIO_DATASET: envField.string({
        context: 'client',
        access: 'public',
        default: 'production',
      }),
      SANITY_STUDIO_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
    validateSecrets: true,
  },
  adapter: netlify({
    imageCDN: false,
    cacheOnDemandPages: true,
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    layout: 'constrained',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  prefetch: {
    prefetchAll: true,
  },

  experimental: {
    // SEE: https://docs.astro.build/en/reference/experimental-flags/fonts/#local-font-variants
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Radio Canada',
        cssVariable: '--font-radio-canada',
      },
    ],
  },

  integrations: [
    sanity({
      projectId: 'vs47sslu',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/admin',
      apiVersion: '2025-08-01',
    }),
    react(),
  ],
})
