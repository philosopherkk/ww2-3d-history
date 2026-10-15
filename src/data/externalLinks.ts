/**
 * External encyclopedia links.
 * Grokipedia (verified host): https://grokipedia.com/page/{Slug}
 *   Slug uses underscores for spaces (same family as Wikipedia titles).
 *   Search fallback (when article slug is unsure): https://grokipedia.com/search?q=
 * Wikipedia: https://en.wikipedia.org/wiki/{Title_with_underscores}
 */

import type { Certainty } from './types'

export type ExternalLink = {
  label: string
  url: string
  /** certain = known article pattern; unsure = search fallback or doubtful exact page */
  certainty: Certainty
}

/** Wikipedia article URL from a human title (spaces → underscores). */
export function wikipediaUrl(title: string): string {
  const slug = title.trim().replace(/ /g, '_')
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(slug).replace(/%2F/g, '/')}`
}

/** Grokipedia article URL — pattern verified: https://grokipedia.com/page/Slug */
export function grokipediaPageUrl(titleOrSlug: string): string {
  const slug = titleOrSlug.trim().replace(/ /g, '_')
  return `https://grokipedia.com/page/${encodeURIComponent(slug).replace(/%2F/g, '/')}`
}

/** Grokipedia search — documented pattern when exact article is unsure. */
export function grokipediaSearchUrl(query: string): string {
  return `https://grokipedia.com/search?q=${encodeURIComponent(query.trim())}`
}

export function wikiLink(title: string, certainty: Certainty = 'certain'): ExternalLink {
  return { label: 'Wikipedia', url: wikipediaUrl(title), certainty }
}

export function grokPageLink(titleOrSlug: string, certainty: Certainty = 'certain'): ExternalLink {
  return { label: 'Grokipedia', url: grokipediaPageUrl(titleOrSlug), certainty }
}

export function grokSearchLink(query: string): ExternalLink {
  return { label: 'Grokipedia (search)', url: grokipediaSearchUrl(query), certainty: 'unsure' }
}
