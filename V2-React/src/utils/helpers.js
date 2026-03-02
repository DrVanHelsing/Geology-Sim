// ================================================================
//  UTILITY HELPERS
// ================================================================

const COMPASS_DIRS = [
  'N','NNE','NE','ENE','E','ESE','SE','SSE',
  'S','SSW','SW','WSW','W','WNW','NW','NNW',
];

/** Convert a bearing (0‑360°) to the nearest 16‑point compass label. */
export function bearingToCompass(bearing) {
  return COMPASS_DIRS[Math.round(bearing / 22.5) % 16];
}

// Sub-metre steps included so the scale bar reads meaningfully at ≤ 0.5 m zoom
const NICE_STEPS = [
  0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5,
  1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000,
];

/** Round down to the nearest "nice" human‑readable scale value. */
export function niceScaleValue(value) {
  let nice = NICE_STEPS[0];
  for (const s of NICE_STEPS) {
    if (s <= value) nice = s;
  }
  return nice;
}

/**
 * Format a distance in metres to a human‑readable string.
 *   < 0.01 m  →  "5 mm"
 *   < 1 m     →  "50 cm"
 *   < 1000 m  →  "500 m"
 *   ≥ 1000 m  →  "2.0 km"
 */
export function formatDistance(meters) {
  if (meters < 0.001) return Math.round(meters * 1000) + ' mm';
  if (meters < 1)     return (meters * 100).toFixed(0) + ' cm';
  if (meters >= 1000) return (meters / 1000).toFixed(1) + ' km';
  return meters + ' m';
}
