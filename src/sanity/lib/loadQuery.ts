import type { ClientPerspective, QueryParams } from '@sanity/client'
import { sanityClient } from './client'

function parsePerspective(raw: string | undefined): ClientPerspective | undefined {
  if (!raw) return undefined
  const decoded = decodeURIComponent(raw)
  if (decoded.startsWith('[')) {
    try {
      return JSON.parse(decoded) as ClientPerspective
    } catch {
      return undefined
    }
  }
  return decoded as ClientPerspective
}

export async function loadQuery<T>({
  query,
  params,
  perspectiveCookie,
}: {
  query: string
  params?: QueryParams
  perspectiveCookie?: string
}): Promise<{ data: T; perspective: ClientPerspective }> {
  const draftMode = Boolean(perspectiveCookie)
  const perspective: ClientPerspective = draftMode
    ? (parsePerspective(perspectiveCookie) ?? 'drafts')
    : 'published'

  const data = await sanityClient.fetch<T>(query, params ?? {}, {
    perspective,
    stega: draftMode,
  })

  return { data, perspective }
}
