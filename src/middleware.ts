import { defineMiddleware } from 'astro:middleware'
import { superscriptMarks } from './lib/superscript-marks'

// Runs at build time for prerendered pages, per request for server-rendered ones.
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()
  if (
    context.url.pathname.startsWith('/admin') ||
    !response.headers.get('content-type')?.includes('text/html')
  ) {
    return response
  }
  const html = superscriptMarks(await response.text())
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
})
