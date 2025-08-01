// @ts-check
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // TODO: replace with prod site URL
  site: 'http://localhost:4321',
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
})
