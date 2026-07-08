// Design tokens synced from the Lovable web app.
//
// This is the single source of truth for the Replit mobile app's colors,
// spacing, and border radius. Web CSS custom properties (HSL / oklch) are
// converted to the sRGB hex + numeric values React Native expects.
//
// Kept intentionally platform-neutral: only design tokens live here. Layout
// density, navigation patterns, and touch behavior are handled per-screen.

/**
 * Color palette.
 *
 * Primary is navy (web #000080). Semantic status colors
 * (success/warning/danger/info) each ship with a `Soft` background variant
 * and a `Foreground` on-color.
 */
export const colors = {
  light: {
    text: '#1A1D35',
    tint: '#000080',
    background: '#F7F9FC',
    foreground: '#1A1D35',
    card: '#FFFFFF',
    cardForeground: '#1A1D35',

    // navy #000080
    primary: '#000080',
    primaryForeground: '#FFFFFF',

    // oklch(0.965 0.02 160) — very light teal
    secondary: '#E6F7F0',
    secondaryForeground: '#1C3B3B',

    // oklch(0.968 0.007 250) — near-white blue-gray
    muted: '#F0F4F9',
    mutedForeground: '#606880',

    // oklch(0.955 0.012 255) — light blue-gray
    accent: '#EBF1FA',
    accentForeground: '#1D2B48',

    destructive: '#CC3D0C',
    destructiveForeground: '#FFFFFF',

    // oklch(0.925 0.008 255)
    border: '#DDE5EF',
    input: '#DDE5EF',

    // oklch(0.6 0.15 155) — slightly darker teal-green than primary
    success: '#0E9866',
    successSoft: '#E2F7EF',
    successForeground: '#FFFFFF',

    // oklch(0.75 0.17 65) — amber-yellow
    warning: '#D99406',
    warningSoft: '#FEF8E7',
    warningForeground: '#5A2D00',

    // oklch(0.62 0.22 27) — red-orange
    danger: '#CC3D0C',
    dangerSoft: '#FEEEE8',
    dangerForeground: '#FFFFFF',

    // oklch(0.62 0.14 200) — teal-blue (cyan)
    info: '#088EB2',
    infoSoft: '#E3F5FA',
    infoForeground: '#FFFFFF',
  },
} as const;

/**
 * Spacing scale (in points).
 *
 * Derived from the web `--spacing: 0.25rem` (4px) base unit. Named steps
 * keep mobile layouts consistent with the web rhythm while allowing
 * mobile-appropriate density.
 */
export const spacing = {
  none: 0,
  xs: 4, // 1 unit
  sm: 8, // 2 units
  md: 12, // 3 units
  lg: 16, // 4 units
  xl: 24, // 6 units
  '2xl': 32, // 8 units
  '3xl': 48, // 12 units
} as const;

/**
 * Border radius scale (in points).
 *
 * Base `radius` mirrors the web `--radius`. The web derives sm/md/lg/xl by
 * offsetting the base; we precompute the same relationships here.
 */
export const radius = {
  sm: 8, // base - 4
  md: 10, // base - 2
  lg: 12, // base (matches legacy constants/colors.ts radius: 12)
  xl: 16, // base + 4
  full: 9999,
} as const;

/**
 * Aggregate design tokens export.
 *
 * Prefer importing `tokens` and reading `tokens.colors.light.*`,
 * `tokens.spacing.*`, and `tokens.radius.*`.
 */
export const tokens = {
  colors,
  spacing,
  radius,
} as const;

export type ColorTokens = typeof colors.light;
export type SpacingTokens = typeof spacing;
export type RadiusTokens = typeof radius;

export default tokens;
