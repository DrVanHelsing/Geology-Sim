// ================================================================
//  TOOL MANAGER — stateless helper functions for each tool
//  Each function receives the engine, operates on it, and returns
//  plain data that gets stored in Zustand.
// ================================================================
import { LAYERS } from '../config/geology';

let _nextMarkerId = 1;
function nextId(prefix) { return `${prefix}-${_nextMarkerId++}`; }

/**
 * Identify: return the geological layer at the clicked point.
 */
export function handleIdentify(engine, point) {
  return engine.getLayerAt(point.x, point.y, point.z);
}

/**
 * Drill: sample a borehole through all layers along a given
 * inclination, azimuth, and max depth.
 * inclination: degrees from vertical (0 = straight down, 90 = horizontal)
 * azimuth:     compass bearing of the borehole direction (degrees CW from N)
 * maxDepth:    maximum down-hole distance to sample (metres)
 */
export function handleDrill(engine, point, { inclination = 0, azimuth = 0, maxDepth = 100 } = {}) {
  const surfaceY = point.y;
  const results  = [];
  const step     = 0.5;
  let depth      = 0;
  const id       = nextId('drill');

  // Borehole direction vector (geographic: N = +Z, E = +X, down = -Y)
  const incRad = inclination * Math.PI / 180;
  const azRad  = azimuth * Math.PI / 180;
  const dirX   =  Math.sin(azRad) * Math.sin(incRad);  // east component
  const dirY   = -Math.cos(incRad);                     // vertical (down)
  const dirZ   =  Math.cos(azRad) * Math.sin(incRad);  // north component

  while (depth <= maxDepth) {
    const sampleX = point.x + dirX * depth;
    const sampleY = surfaceY + dirY * depth;
    const sampleZ = point.z + dirZ * depth;

    if (sampleY < 0) break;  // below world floor

    const layer = engine.getLayerAt(sampleX, sampleY, sampleZ);

    if (results.length === 0 || results[results.length - 1].layer.name !== layer.name) {
      results.push({ layer, startDepth: depth, endDepth: depth });
    } else {
      results[results.length - 1].endDepth = depth;
    }
    depth += step;
  }

  engine.addDrillMarker(point, id, { inclination, azimuth });

  return {
    id,
    results,
    position: { x: point.x, y: point.y, z: point.z },
    surfaceY,
    inclination,
    azimuth,
    maxDepth,
    timestamp: Date.now(),
  };
}

/**
 * Measure: accumulate two points; on second click compute metrics.
 * Returns null on the first click, result object on the second.
 */
export function handleMeasure(engine, point) {
  const count = engine.addMeasurePoint(point, nextId('mpt'));

  if (count === 2) {
    const [a, b]     = engine.getMeasurePoints();
    const dist       = a.distanceTo(b);
    const horizDist  = Math.sqrt((b.x - a.x) ** 2 + (b.z - a.z) ** 2);
    const elevChange = b.y - a.y;
    const bearing    = (Math.atan2(b.x - a.x, b.z - a.z) * 180 / Math.PI + 360) % 360;
    const slope      = Math.atan2(Math.abs(elevChange), horizDist) * 180 / Math.PI;
    const id         = nextId('measure');

    engine.addMeasureLine(a, b, id);

    // Reset internal points for next measurement, but keep markers visible
    engine._measurePoints = [];

    return {
      id,
      distance: dist, horizDistance: horizDist, elevChange, bearing, slope,
      pointA: { x: a.x, y: a.y, z: a.z },
      pointB: { x: b.x, y: b.y, z: b.z },
      timestamp: Date.now(),
    };
  }

  return null;
}

/**
 * Clear current measurement markers from the scene.
 */
export function clearMeasure(engine) {
  engine.clearMeasure();
}

// ──────────────────────────────────────────────
//  Strike & Dip — measure bedding surface orientation
// ──────────────────────────────────────────────
export function handleStrikeDip(engine, point) {
  const dx = 5;
  const p = engine.getBeddingAt.bind(engine);

  // Central-difference gradient of the bedding perturbation surface
  const gradX = (p(point.x + dx, point.z) - p(point.x - dx, point.z)) / (2 * dx);
  const gradZ = (p(point.x, point.z + dx) - p(point.x, point.z - dx)) / (2 * dx);

  const dipMag = Math.sqrt(gradX * gradX + gradZ * gradZ);
  const dipAngle = Math.atan(dipMag) * 180 / Math.PI;

  // Down-dip direction (azimuth clockwise from North / +Z)
  let dipDirection = Math.atan2(-gradX, -gradZ) * 180 / Math.PI;
  dipDirection = (dipDirection + 360) % 360;

  // Strike: 90° counterclockwise from dip
  let strike = (dipDirection + 270) % 360;

  const layer = engine.getLayerAt(point.x, point.y, point.z);
  const id = nextId('sd');
  engine.addStrikeDipMarker(point, strike, id, dipDirection, dipAngle);

  return {
    id,
    strike: Math.round(strike * 10) / 10,
    dip: Math.round(dipAngle * 10) / 10,
    dipDirection: Math.round(dipDirection * 10) / 10,
    position: { x: Math.round(point.x), y: Math.round(point.y), z: Math.round(point.z) },
    layerName: layer.name,
  };
}

// ──────────────────────────────────────────────
//  Cross-section — two-click line sampling
// ──────────────────────────────────────────────
export function handleCrossSection(engine, point) {
  const count = engine.addCrossSectionPoint(point);

  if (count === 2) {
    const [a, b] = engine.getCrossSectionPoints();
    const data = sampleCrossSection(engine, a, b);
    engine.clearCrossSection();
    return data;
  }
  return null;
}

function sampleCrossSection(engine, a, b, numSamples = 200) {
  const totalDist = Math.sqrt((b.x - a.x) ** 2 + (b.z - a.z) ** 2);
  const samples = [];

  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const wx = a.x + (b.x - a.x) * t;
    const wz = a.z + (b.z - a.z) * t;
    const surfaceY = engine.getTerrainHeightAt(wx, wz);
    const distance = t * totalDist;

    // Trace layers below surface
    const layers = [];
    const step = 0.5;
    let currentLayer = null;

    for (let depth = 0; surfaceY - depth >= 0; depth += step) {
      const elev = surfaceY - depth;
      const layer = engine.getLayerAt(wx, elev, wz);
      if (!currentLayer || currentLayer.name !== layer.name) {
        if (currentLayer) currentLayer.bottomElevation = elev;
        currentLayer = { name: layer.name, color: layer.color, hex: layer.hex, topElevation: elev, bottomElevation: elev };
        layers.push(currentLayer);
      } else {
        currentLayer.bottomElevation = elev;
      }
    }
    if (currentLayer) currentLayer.bottomElevation = 0;

    samples.push({ distance, surfaceElevation: surfaceY, layers });
  }

  return { samples, totalDistance: totalDist, bearing: (Math.atan2(b.x - a.x, b.z - a.z) * 180 / Math.PI + 360) % 360 };
}

export function clearCrossSection(engine) {
  engine.clearCrossSection();
}

export function clearStrikeDip(engine) {
  engine.clearStrikeDip();
}
