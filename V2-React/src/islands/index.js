// ================================================================
//  ISLAND REGISTRY
//  Maps island id → full island definition object.
//  Add new islands here; the engine picks them up automatically.
// ================================================================
import { hadleyIsland     } from './hadley';
import { mysteriousIsland } from './mysterious';

export const ISLAND_DEFS = {
  survey:     hadleyIsland,
  mysterious: mysteriousIsland,
  // volcanic: volcanicIsland,   // add when implemented
  // arctic:   arcticIsland,     // add when implemented
};

/**
 * Look up an island definition by id.
 * Falls back to 'survey' (Hadley Island) if the id is unknown.
 * @param {string} id
 * @returns {object} island definition
 */
export function getIslandDef(id) {
  return ISLAND_DEFS[id] ?? ISLAND_DEFS.survey;
}
