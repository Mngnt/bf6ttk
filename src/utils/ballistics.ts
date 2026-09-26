import { WeaponRaw, SimulationParams, ComputedMetrics } from '../types/weapon';

/**
 * Calculates raw bullet damage at a given distance using piecewise linear interpolation.
 */
export function getDamageAtDistance(
  weapon: WeaponRaw,
  distance: number,
  hitMultiplier: number = 1.0,
  pelletRatio: number = 1.0
): number {
  const { dmgs, dists } = weapon.damage;
  if (!dmgs || !dists || dmgs.length === 0 || dists.length === 0) {
    return 0;
  }

  const clampedDist = Math.max(0, distance);
  let baseDamage = dmgs[0];

  if (clampedDist <= dists[0]) {
    baseDamage = dmgs[0];
  } else if (clampedDist >= dists[dists.length - 1]) {
    baseDamage = dmgs[dmgs.length - 1];
  } else {
    // Find segment
    for (let i = 0; i < dists.length - 1; i++) {
      const d1 = dists[i];
      const d2 = dists[i + 1];

      if (clampedDist >= d1 && clampedDist <= d2) {
        if (d1 === d2) {
          // Instantaneous step drop
          baseDamage = clampedDist === d1 ? dmgs[i + 1] : dmgs[i];
        } else {
          // Linear interpolation between the two breakpoints
          const t = (clampedDist - d1) / (d2 - d1);
          baseDamage = dmgs[i] + t * (dmgs[i + 1] - dmgs[i]);
        }
        break;
      }
    }
  }

  // Account for pellets (shotguns have 16 pellets)
  const pellets = weapon.pellets || 1;
  const effectivePellets = pellets === 1 ? 1 : Math.max(1, Math.round(pellets * pelletRatio));
  const shotDamage = baseDamage * effectivePellets;

  // Apply hit location multiplier (e.g. 1.0 body, 1.5 head, etc.)
  return shotDamage * hitMultiplier;
}

/**
 * Calculates Bullets to Kill (BTK) at a given distance
 */
export function getBTK(
  weapon: WeaponRaw,
  distance: number,
  targetHealth: number = 100,
  hitMultiplier: number = 1.0,
  pelletRatio: number = 1.0
): number {
  const dmg = getDamageAtDistance(weapon, distance, hitMultiplier, pelletRatio);
  if (dmg <= 0) return 999;
  return Math.max(1, Math.ceil(targetHealth / dmg));
}

/**
 * Calculates Time to Kill (TTK) in milliseconds
 */
export function getTTK(
  weapon: WeaponRaw,
  distance: number,
  params: SimulationParams
): number {
  const btk = getBTK(weapon, distance, params.targetHealth, params.hitMultiplier, params.pelletRatio);
  const rof = weapon.rof?.RoF || 600;

  // First bullet fires at t = 0
  if (btk <= 1) {
    // 1-shot kill (e.g. shotgun point blank or sniper sweet spot)
    const travelTime = params.includeTravelTime
      ? ((distance / (weapon.velocity || 500)) * 1000)
      : 0;
    return Math.round(travelTime * 10) / 10;
  }

  const timeBetweenShotsMs = (60 / rof) * 1000;
  const firingTimeMs = (btk - 1) * timeBetweenShotsMs;

  let travelTimeMs = 0;
  if (params.includeTravelTime) {
    const velocity = weapon.velocity || 500;
    travelTimeMs = (distance / velocity) * 1000;
  }

  return Math.round((firingTimeMs + travelTimeMs) * 10) / 10;
}

/**
 * Calculates Kills Per Magazine at a given distance
 */
export function getKillsPerMag(
  weapon: WeaponRaw,
  distance: number,
  targetHealth: number = 100,
  hitMultiplier: number = 1.0,
  pelletRatio: number = 1.0
): { exact: number; fullKills: number } {
  const btk = getBTK(weapon, distance, targetHealth, hitMultiplier, pelletRatio);
  const magSize = weapon.mags?.MagSize || 30;

  if (btk <= 0) return { exact: 0, fullKills: 0 };
  const exact = Math.round((magSize / btk) * 100) / 100;
  const fullKills = Math.floor(magSize / btk);
  return { exact, fullKills };
}

/**
 * Calculates Damage Per Second (DPS) at a given distance
 */
export function getDPS(
  weapon: WeaponRaw,
  distance: number,
  hitMultiplier: number = 1.0,
  pelletRatio: number = 1.0
): number {
  const dmg = getDamageAtDistance(weapon, distance, hitMultiplier, pelletRatio);
  const rof = weapon.rof?.RoF || 600;
  return Math.round((dmg * (rof / 60)) * 10) / 10;
}

/**
 * Identifies the dropoff start and dropoff end ranges
 */
export function getDamageRanges(weapon: WeaponRaw): { maxDmgRange: number; minDmgRange: number } {
  const { dmgs, dists } = weapon.damage;
  if (!dmgs || !dists || dmgs.length === 0) {
    return { maxDmgRange: 0, minDmgRange: 0 };
  }

  const initialDmg = dmgs[0];
  let maxDmgRange = 0;
  let minDmgRange = dists[dists.length - 1];

  for (let i = 0; i < dists.length; i++) {
    if (dmgs[i] < initialDmg) {
      maxDmgRange = dists[i - 1] !== undefined ? dists[i - 1] : dists[i];
      break;
    }
  }

  // If sniper with sweet spot where dmg increases first
  const maxDamageVal = Math.max(...dmgs);
  if (maxDamageVal > initialDmg) {
    const idxMax = dmgs.indexOf(maxDamageVal);
    maxDmgRange = dists[idxMax];
  }

  return {
    maxDmgRange: Math.round(maxDmgRange * 10) / 10,
    minDmgRange: Math.round(minDmgRange * 10) / 10
  };
}

/**
 * Parses reload values into numeric seconds
 */
export function parseReloadSeconds(val: string | number | undefined | null): number | null {
  if (val === undefined || val === null || val === 'N/A') return null;
  if (typeof val === 'number') return val;
  const num = parseFloat(String(val).replace('s', ''));
  return isNaN(num) ? null : num;
}

/**
 * Computes high-level summary metrics for quick sorting and display
 */
export function computeWeaponMetrics(weapon: WeaponRaw, params: SimulationParams): ComputedMetrics {
  const { maxDmgRange, minDmgRange } = getDamageRanges(weapon);

  const closeDmg = Math.round(getDamageAtDistance(weapon, 5, params.hitMultiplier, params.pelletRatio) * 10) / 10;
  const farDmg = Math.round(getDamageAtDistance(weapon, 80, params.hitMultiplier, params.pelletRatio) * 10) / 10;

  const closeBTK = getBTK(weapon, 5, params.targetHealth, params.hitMultiplier, params.pelletRatio);
  const farBTK = getBTK(weapon, 80, params.targetHealth, params.hitMultiplier, params.pelletRatio);

  const closeTTK = getTTK(weapon, 10, params);
  const midTTK = getTTK(weapon, 45, params);
  const longTTK = getTTK(weapon, 85, params);

  const closeKPM = getKillsPerMag(weapon, 5, params.targetHealth, params.hitMultiplier, params.pelletRatio).exact;
  const farKPM = getKillsPerMag(weapon, 80, params.targetHealth, params.hitMultiplier, params.pelletRatio).exact;

  const magSize = weapon.mags?.MagSize || 30;
  const magDamageClose = Math.round(closeDmg * magSize);
  const magDamageFar = Math.round(farDmg * magSize);

  const dpsClose = getDPS(weapon, 5, params.hitMultiplier, params.pelletRatio);
  const dpsFar = getDPS(weapon, 80, params.hitMultiplier, params.pelletRatio);

  const tacticalReloadSeconds = parseReloadSeconds(weapon.reload?.ReloadLeft);
  const emptyReloadSeconds = parseReloadSeconds(weapon.reload?.ReloadEmpty);

  return {
    closeDmg,
    farDmg,
    maxDmgRange,
    minDmgRange,
    closeBTK,
    farBTK,
    closeTTK,
    midTTK,
    longTTK,
    closeKPM,
    farKPM,
    magDamageClose,
    magDamageFar,
    dpsClose,
    dpsFar,
    tacticalReloadSeconds,
    emptyReloadSeconds
  };
}
