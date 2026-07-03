// Colors converted from the Lovable web app's CSS (oklch → sRGB hex).
// Primary is teal-green (oklch 0.62 0.17 165), not blue.
const colors = {
  light: {
    text: '#1A1D35',
    tint: '#0BA871',
    background: '#F7F9FC',
    foreground: '#1A1D35',
    card: '#FFFFFF',
    cardForeground: '#1A1D35',

    // oklch(0.62 0.17 165) — teal-green
    primary: '#0BA871',
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
  radius: 12,
};

export default colors;
