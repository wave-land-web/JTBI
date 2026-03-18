// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField, fontProviders } from 'astro/config'

const tailwindPlugin = /** @type {any} */ (tailwindcss())

// https://astro.build/config
export default defineConfig({
  site: 'https://jtbimaginative.com',
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
      AKISMET_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_AUDIENCE_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_API_KEY: envField.string({
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

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Radio Canada',
      cssVariable: '--font-radio-canada',
    },
  ],

  vite: {
    plugins: [tailwindPlugin],
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

  integrations: [
    sanity({
      projectId: 'vs47sslu',
      dataset: 'production',
      useCdn: false,
      apiVersion: '2025-01-28',
      studioBasePath: '/admin',
    }),
    react(),
    sitemap({
      lastmod: new Date(),
      filter: (page) =>
        page !== 'https://jtbimaginative.com/404/' &&
        page !== 'https://jtbimaginative.com/unsubscribed/',
    }),
  ],
})
