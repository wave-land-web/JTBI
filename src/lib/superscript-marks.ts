/**
 * Wraps every ® and ™ in page TEXT in `<sup class="mark-sup">`, since the
 * characters sit at full size in most fonts. Editors type the mark straight
 * into Sanity and the site sizes it. Tags, scripts, styles and the `<title>`
 * are passed through untouched: a `<sup>` inside an attribute, the JSON-LD or
 * the tab title would print as literal markup.
 */
const SKIP =
  /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<title\b[\s\S]*?<\/title>|<[^>]*>)/gi

export function superscriptMarks(html: string): string {
  return html
    .split(SKIP)
    .map((chunk, i) =>
      // Odd indexes are the skipped matches.
      i % 2 ? chunk : chunk.replace(/[®™]/g, '<sup class="mark-sup">$&</sup>'),
    )
    .join('')
}
