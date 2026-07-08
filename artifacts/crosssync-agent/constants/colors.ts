// Re-exports the color palette from the synced design tokens.
//
// Design tokens now live in theme/tokens.ts (single source of truth synced
// from Lovable). This file is preserved for backwards compatibility with
// existing imports (e.g. useColors) and simply re-shapes the token export
// into the historical `{ light, radius }` structure.
import { colors as tokenColors, radius as radiusTokens } from '@/theme/tokens';

const colors = {
  light: tokenColors.light,
  // Historical numeric `radius` maps to the base (lg) radius token.
  radius: radiusTokens.lg,
};

export default colors;
