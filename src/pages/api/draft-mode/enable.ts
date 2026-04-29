import { SANITY_STUDIO_SECRET_TOKEN } from 'astro:env/server'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import type { APIRoute } from 'astro'
import { sanityClient } from '../../../sanity/lib/client'

export const prerender = false

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  if (!SANITY_STUDIO_SECRET_TOKEN) {
    return new Response('Server misconfigured: missing SANITY_STUDIO_SECRET_TOKEN', {
      status: 500,
    })
  }

  const clientWithToken = sanityClient.withConfig({
    token: SANITY_STUDIO_SECRET_TOKEN,
  })
  const {
    isValid,
    redirectTo = '/',
    studioPreviewPerspective,
  } = await validatePreviewUrl(clientWithToken, request.url)

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  cookies.set(perspectiveCookieName, studioPreviewPerspective ?? 'drafts', {
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    path: '/',
  })

  return redirect(redirectTo, 307)
}
