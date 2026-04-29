import type { ClientPerspective } from '@sanity/client'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import {
  type HistoryAdapter,
  type HistoryUpdate,
  VisualEditing,
} from '@sanity/visual-editing/react'
import { useEffect, useMemo, useRef } from 'react'

function serializePerspective(perspective: ClientPerspective): string {
  return typeof perspective === 'string' ? perspective : JSON.stringify(perspective)
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

interface CookieStoreLike {
  set(options: {
    name: string
    value: string
    path?: string
    sameSite?: 'strict' | 'lax' | 'none'
    secure?: boolean
  }): Promise<void>
}

function getCookieStore(): CookieStoreLike | undefined {
  return (globalThis as unknown as { cookieStore?: CookieStoreLike }).cookieStore
}

async function setPerspectiveCookie(perspective: ClientPerspective): Promise<boolean> {
  const next = serializePerspective(perspective)
  const current = getCookie(perspectiveCookieName)
  if (current === next) return false

  const store = getCookieStore()
  if (store) {
    await store.set({
      name: perspectiveCookieName,
      value: next,
      path: '/',
      sameSite: 'none',
      secure: true,
    })
  } else {
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore unavailable in Firefox/Safari; this is editor-only code
    document.cookie = `${perspectiveCookieName}=${encodeURIComponent(next)}; path=/; SameSite=None; Secure`
  }

  return true
}

function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function applyHistoryUpdate(update: Pick<HistoryUpdate, 'type' | 'url'>, currentHref: string) {
  switch (update.type) {
    case 'push':
      if (currentHref !== update.url) window.location.assign(update.url)
      return
    case 'replace':
      if (currentHref !== update.url) window.location.replace(update.url)
      return
    case 'pop':
      window.history.back()
      return
  }
}

export default function SanityVisualEditing() {
  type Navigate = Parameters<HistoryAdapter['subscribe']>[0]
  const navigateRef = useRef<Navigate | undefined>(undefined)
  const lastUrlRef = useRef('')

  useEffect(() => {
    const sync = () => {
      const url = currentUrl()
      if (url !== lastUrlRef.current) {
        lastUrlRef.current = url
        navigateRef.current?.({ type: 'push', title: document.title, url })
      }
    }

    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)

    const origPush = window.history.pushState
    const origReplace = window.history.replaceState
    window.history.pushState = (...args) => {
      origPush.apply(window.history, args)
      sync()
    }
    window.history.replaceState = (...args) => {
      origReplace.apply(window.history, args)
      sync()
    }

    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
      window.history.pushState = origPush
      window.history.replaceState = origReplace
    }
  }, [])

  const history = useMemo<HistoryAdapter>(
    () => ({
      subscribe: (navigate) => {
        navigateRef.current = navigate
        const url = currentUrl()
        lastUrlRef.current = url
        navigate({ type: 'push', title: document.title, url })
        return () => {
          if (navigateRef.current === navigate) {
            navigateRef.current = undefined
          }
        }
      },
      update: (update) => {
        applyHistoryUpdate(update, window.location.href)
      },
    }),
    [],
  )

  return (
    <VisualEditing
      history={history}
      portal={true}
      onPerspectiveChange={(perspective) => {
        void setPerspectiveCookie(perspective).then((changed) => {
          if (changed) window.location.reload()
        })
      }}
      refresh={() =>
        new Promise((resolve) => {
          window.location.reload()
          resolve()
        })
      }
    />
  )
}
