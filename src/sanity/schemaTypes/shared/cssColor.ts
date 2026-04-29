import type { StringRule } from 'sanity'

/**
 * Permissive CSS color validator.
 * Accepts:
 *   - Hex: #rgb, #rrggbb, #rrggbbaa
 *   - CSS variables: var(--color-base-100) or var(--x, #fff)
 *   - Color functions: rgb(), rgba(), hsl(), hsla(), oklch(), oklab(), color(), hwb(), lab(), lch()
 *   - Named colors: any single word (e.g. red, transparent, currentColor)
 */
const CSS_COLOR_REGEX =
  /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|var\([^)]+\)|(rgb|rgba|hsl|hsla|oklch|oklab|color|hwb|lab|lch)\([^)]+\)|[a-zA-Z]+)$/

export const COLOR_FIELD_DESCRIPTION =
  'Accepts hex (#d94b43), CSS variables (var(--color-base-100)), color functions (rgb/hsl/oklch), or named colors.'

export const cssColorValidation = (rule: StringRule): StringRule =>
  rule
    .regex(CSS_COLOR_REGEX, { name: 'css color' })
    .error(
      'Use a hex value, CSS variable (e.g. var(--color-base-100)), color function, or named color.',
    )
