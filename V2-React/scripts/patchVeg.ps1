$f = "c:\Users\tredi\Documents\Projects\Geology Sim\V2-React\src\engine\VegetationSystem.js"
$t = [IO.File]::ReadAllText($f)

# 1. Remove old import lines (try both CRLF and LF)
$t = $t.Replace("import { TERRAIN_SIZE, SEGMENTS, WATER_LEVEL, getLayerAtElevation } from '../config/geology';`r`n", "")
$t = $t.Replace("import { TERRAIN_SIZE, SEGMENTS, WATER_LEVEL, getLayerAtElevation } from '../config/geology';`n", "")
$t = $t.Replace("import { LAKES, RIVERS, FARM } from './TerrainGenerator';`r`n", "")
$t = $t.Replace("import { LAKES, RIVERS, FARM } from './TerrainGenerator';`n", "")

# 2. After THREE import, insert context declarations
$ctxDecl = "`r`n`r`n/* -- Per-call island context (set at the top of createVegetation) --- */`r`nlet _size, _segments, _waterLevel, _lakes, _denseRivers, _farm, _getLayerByElevation;"
$t = $t.Replace("import * as THREE from 'three';", "import * as THREE from 'three';" + $ctxDecl)

# 3. Remove the _crVal + getDenseRivers block
#    Find comment start
$marker1 = "/* - Dense Catmull-Rom"
$bs = -1
for ($i = 0; $i -lt $t.Length - 3; $i++) {
  if ($t.Substring($i, [Math]::Min(24, $t.Length - $i)) -eq "/* - Dense Catmull-Rom") { $bs = $i; break }
  if ($t.Substring($i, [Math]::Min(26, $t.Length - $i)) -eq "/* -- Dense Catmull-Rom") { $bs = $i; break }
}
# Also check for the unicode dash version
if ($bs -lt 0) {
  $needle = "let _denseRivers = null;"
  $bs2 = $t.IndexOf($needle)
  if ($bs2 -ge 0) {
    # Walk back to find the comment before it
    $prevNL = $t.LastIndexOf("`n", $bs2 - 2)
    $bs = $prevNL + 1
    Write-Host "Using fallback block start at $bs"
  }
}
if ($bs -ge 0) {
  $endPattern = "return _denseRivers;`r`n}"
  $be = $t.IndexOf($endPattern, $bs)
  if ($be -lt 0) { $endPattern = "return _denseRivers;`n}"; $be = $t.IndexOf($endPattern, $bs) }
  if ($be -ge 0) {
    $endIdx = $be + $endPattern.Length
    # Skip trailing newlines
    while ($endIdx -lt $t.Length -and ($t[$endIdx] -eq "`r" -or $t[$endIdx] -eq "`n")) { $endIdx++ }
    $t = $t.Remove($bs, $endIdx - $bs)
    Write-Host "Removed getDenseRivers block OK"
  } else { Write-Host "WARNING: block end not found" }
} else { Write-Host "WARNING: block start not found - skipping removal" }

# 4. Bulk constant replacements
$t = $t.Replace("TERRAIN_SIZE", "_size")
$t = $t.Replace("SEGMENTS",     "_segments")
$t = $t.Replace("WATER_LEVEL",  "_waterLevel")
$t = $t.Replace("LAKES",        "_lakes")
$t = $t.Replace("FARM.",        "_farm.")
$t = $t.Replace("getDenseRivers()", "_denseRivers")
$t = $t.Replace("getLayerAtElevation(", "_getLayerByElevation(")

# 5. Change createVegetation signature + inject island context setup
$oldSig = "export function createVegetation(hm, noise) {"
$newSig  = "export function createVegetation(hm, noise, islandDef) {`r`n  const { size, segments, waterLevel } = islandDef.terrain;`r`n  _size = size; _segments = segments; _waterLevel = waterLevel;`r`n  _lakes = islandDef.lakes;`r`n  _farm  = islandDef.farm;`r`n  _denseRivers = islandDef.rivers.map(r => ({ ...r, densePoints: islandDef.getDenseRiverPath(r) }));`r`n  _getLayerByElevation = h => islandDef.getLayerByElevation(h);"
if ($t.Contains($oldSig)) {
  $t = $t.Replace($oldSig, $newSig)
  Write-Host "Signature patched OK"
} else {
  $newSigLF = $newSig.Replace("`r`n", "`n")
  $t = $t.Replace($oldSig, $newSigLF)
  Write-Host "Signature patched (LF fallback)"
}

[IO.File]::WriteAllText($f, $t)
Write-Host "Done. Lines: $((Get-Content $f).Count)"
