import { WeaponClass } from '../types/weapon';

export interface ClassMeta {
  id: WeaponClass;
  label: string;
  shortLabel: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  description: string;
}

export const WEAPON_CLASSES: Record<WeaponClass, ClassMeta> = {
  assaultrifle: {
    id: 'assaultrifle',
    label: 'Assault Rifles',
    shortLabel: 'AR',
    color: '#38bdf8', // sky-400
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderColor: '#38bdf8',
    description: 'Versatile automatic rifles effective across close to medium combat ranges.'
  },
  carbine: {
    id: 'carbine',
    label: 'Carbines',
    shortLabel: 'Carbine',
    color: '#2dd4bf', // teal-400
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    borderColor: '#2dd4bf',
    description: 'Lightweight, agile carbines with high mobility and rapid handling.'
  },
  smg: {
    id: 'smg',
    label: 'Submachine Guns',
    shortLabel: 'SMG',
    color: '#a855f7', // purple-500
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderColor: '#a855f7',
    description: 'High fire-rate weapons with superior hipfire for close-quarters lethality.'
  },
  mg: {
    id: 'mg',
    label: 'Machine Guns',
    shortLabel: 'LMG',
    color: '#f59e0b', // amber-500
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderColor: '#f59e0b',
    description: 'Sustained fire powerhouses with massive magazines and suppressive capacity.'
  },
  dmr: {
    id: 'dmr',
    label: 'Designated Marksman',
    shortLabel: 'DMR',
    color: '#06b6d4', // cyan-500
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderColor: '#06b6d4',
    description: 'Semi-automatic precision rifles for dominant mid to long-range engagements.'
  },
  boltaction: {
    id: 'boltaction',
    label: 'Bolt-Action Snipers',
    shortLabel: 'Sniper',
    color: '#ec4899', // pink-500
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    borderColor: '#ec4899',
    description: 'High-damage, slow-firing rifles capable of one-shot sweet-spot kills.'
  },
  shotgun: {
    id: 'shotgun',
    label: 'Shotguns',
    shortLabel: 'Shotgun',
    color: '#f97316', // orange-500
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    borderColor: '#f97316',
    description: 'Multi-pellet spread weapons that annihilate targets at point-blank range.'
  },
  secondary: {
    id: 'secondary',
    label: 'Secondaries / Pistols',
    shortLabel: 'Pistol',
    color: '#94a3b8', // slate-400
    badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    borderColor: '#94a3b8',
    description: 'Sidearms, revolvers, and machine pistols for quick backup engagements.'
  }
};

export const COMPARISON_COLORS = [
  '#00f0ff', // Cyan neon
  '#ff4444', // Red
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#eab308', // Yellow
  '#f97316', // Orange
];
