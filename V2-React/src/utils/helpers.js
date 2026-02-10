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

const NICE_STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];

/** Round down to the nearest "nice" human‑readable scale value. */
export function niceScaleValue(value) {
  let nice = NICE_STEPS[0];
  for (const s of NICE_STEPS) {
    if (s <= value) nice = s;
  }
  return nice;
}

/** Format metres → "500 m" or "2.0 km". */
export function formatDistance(meters) {
  return meters >= 1000 ? (meters / 1000).toFixed(1) + ' km' : meters + ' m';
}
