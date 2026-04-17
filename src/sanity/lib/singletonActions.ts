import type { DocumentActionComponent } from 'sanity'

/**
 * Document types that should exist as a single document.
 * Clients should not be able to duplicate or delete these.
 */
export const SINGLETON_TYPES = new Set<string>(['siteSettings', 'homepage', 'notFoundPage'])

/**
 * Actions filter that removes destructive actions for singleton documents.
 */
export const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export function filterSingletonActions(
  prev: DocumentActionComponent[],
  context: { schemaType: string },
): DocumentActionComponent[] {
  if (SINGLETON_TYPES.has(context.schemaType)) {
    return prev.filter(({ action }) => action && singletonActions.has(action))
  }
  return prev
}
