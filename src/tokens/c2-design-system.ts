/**
 * C2 Design System Tokens
 * Source: JCHAT-SK/Visual_SIM/references/xr-visual-language.md
 *
 * Colors follow the Command & Control visual language spec.
 * Typography uses angular-spec sizes (1.0°–2.0° at 20PPD viewing distance).
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const C2_COLORS = {
  // Backgrounds
  bgPrimary:   '#0A0E14',  // Panel backgrounds
  bgSecondary: '#141B24',  // Nested panels / inset surfaces

  // Text
  textPrimary:   '#E6EDF3',  // Primary readable text
  textSecondary: '#8B949E',  // Labels, metadata

  // Accents (sensor-mode aware)
  accentBlue:  '#58A6FF',  // OPTICAL mode / interactive elements
  accentGreen: '#3FB950',  // SAR mode / nominal status
  accentAmber: '#D29922',  // Caution / THERMAL mode
  accentRed:   '#F85149',  // Critical / danger / conjunction alert
  accentCyan:  '#39D2C0',  // Measurement overlays / telemetry
} as const;

// Three.js hex strings (same values, used directly in Three.js Color objects)
export const C2_THREE_COLORS = {
  orbOptical: '#0066ff',
  orbSAR:     '#3FB950',
  orbThermal: '#D29922',
  orbitOpticalConjunction: '#F85149',
  orbitOpticalSafe:        '#58A6FF',
  orbitSAR:     '#3FB950',
  orbitThermal: '#D29922',
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────
// Sizes derived from angular spec: 1.0°–2.0° at 20PPD (monitor viewing distance)

export const C2_TYPOGRAPHY = {
  WARNING_TEXT: 'text-[2.5rem]',  // 2.0° — alert text
  PANEL_TITLE:  'text-[2rem]',    // 1.6° — section headers
  HUD_LABEL:    'text-[1.5rem]',  // 1.2° — replaces text-[10px] in HUD
  CALLOUT_TAG:  'text-[1.25rem]', // 1.0° — replaces text-[8px], text-[9px]
  DATA_READOUT: 'font-mono text-[1.5rem]', // telemetry values
} as const;
