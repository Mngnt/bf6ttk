import { WeaponRaw, ProcessedWeapon, SimulationParams, DatasetInfo, WeaponClass } from '../types/weapon';
import { computeWeaponMetrics } from './ballistics';
import { WEAPON_CLASSES } from './constants';
import rawDataJson from '../data/bf6.json';

export function parseDataset(rawData: Record<string, any>, params: SimulationParams): {
  weapons: ProcessedWeapon[];
  info: DatasetInfo;
} {
  const info: DatasetInfo = {
    version: rawData.info?.version || '1.0.0',
    versionDate: rawData.info?.versionDate || 'Unknown'
  };

  const weapons: ProcessedWeapon[] = [];

  for (const [key, value] of Object.entries(rawData)) {
    if (key === 'info') continue;
    if (!value || typeof value !== 'object' || !value.displayname) continue;

    const rawWeapon = value as WeaponRaw;
    const weaponClass = rawWeapon.class as WeaponClass;
    const classMeta = WEAPON_CLASSES[weaponClass];

    const metrics = computeWeaponMetrics(rawWeapon, params);

    weapons.push({
      ...rawWeapon,
      id: key,
      classLabel: classMeta ? classMeta.shortLabel : rawWeapon.class,
      metrics
    });
  }

  return { weapons, info };
}

export function getDefaultDataset(params: SimulationParams): {
  weapons: ProcessedWeapon[];
  info: DatasetInfo;
} {
  return parseDataset(rawDataJson as Record<string, any>, params);
}

export function exportWeaponsToCsv(weapons: ProcessedWeapon[]): void {
  const headers = [
    'Codename',
    'Display Name',
    'Class',
    'RPM',
    'Mag Size',
    'Muzzle Velocity (m/s)',
    'Max Damage',
    'Min Damage',
    'Max Dmg Range (m)',
    'Min Dmg Range (m)',
    'Close TTK (10m ms)',
    'Mid TTK (45m ms)',
    'Long TTK (85m ms)',
    'Close BTK',
    'Far BTK',
    'Close Kills/Mag',
    'Far Kills/Mag',
    'Reload Tactical (s)',
    'Reload Empty (s)',
    'Deploy Time (s)',
    'Caliber Ammo'
  ];

  const rows = weapons.map(w => [
    w.codename,
    `"${w.displayname}"`,
    w.class,
    w.rof.RoF.toFixed(1),
    w.mags.MagSize,
    w.velocity,
    w.metrics.closeDmg.toFixed(1),
    w.metrics.farDmg.toFixed(1),
    w.metrics.maxDmgRange,
    w.metrics.minDmgRange,
    w.metrics.closeTTK.toFixed(1),
    w.metrics.midTTK.toFixed(1),
    w.metrics.longTTK.toFixed(1),
    w.metrics.closeBTK,
    w.metrics.farBTK,
    w.metrics.closeKPM.toFixed(1),
    w.metrics.farKPM.toFixed(1),
    w.metrics.tacticalReloadSeconds ?? 'N/A',
    w.metrics.emptyReloadSeconds ?? 'N/A',
    w.deploy.DeployTime.toFixed(2),
    `"${w.ammo}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `bf6_weapons_ttk_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
