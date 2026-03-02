import { mysteriousIsland } from '../src/islands/mysterious.js';

function hashNoise(seed = 1) {
  return (x, y) => {
    const s = Math.sin((x * 12.9898 + y * 78.233 + seed * 37.719)) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
}

const noise = hashNoise(73);
const noiseB = hashNoise(211);
const size = mysteriousIsland.terrain.size;
const half = size / 2;

let peak = -Infinity;
let sumAll = 0;
let countAll = 0;
let sumIsland = 0;
let countIsland = 0;

for (let z = -half; z <= half; z += 20) {
  for (let x = -half; x <= half; x += 20) {
    const h = mysteriousIsland.generateHeight(noise, noiseB, x, z);
    if (h > peak) peak = h;

    sumAll += h;
    countAll += 1;

    const nx = x / half;
    const nz = z / half;
    const ellipR = Math.sqrt((nx / 1.0) ** 2 + (nz / 0.875) ** 2);
    if (ellipR <= 1) {
      sumIsland += h;
      countIsland += 1;
    }
  }
}

const avgAll = sumAll / countAll;
const avgIsland = sumIsland / countIsland;

console.log(JSON.stringify({
  samples: countAll,
  islandSamples: countIsland,
  peak,
  avgAll,
  avgIsland,
  checks: {
    peakUnder650: peak < 650,
    avgIslandOver200: avgIsland > 200
  }
}, null, 2));
