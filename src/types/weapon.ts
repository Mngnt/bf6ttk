export type WeaponClass =
  | 'assaultrifle'
  | 'carbine'
  | 'smg'
  | 'mg'
  | 'dmr'
  | 'boltaction'
  | 'shotgun'
  | 'secondary';

export interface WeaponDamage {
  dmgs: number[];
  dists: number[];
}

export interface WeaponRoF {
  RoF: number;
  BurstRoF?: number;
  SingleRoF?: number;
}

export interface WeaponMags {
  MagSize: number;
  NumMags: number;
}

export interface WeaponReload {
  CustomReload?: any;
  SingleBulletReloadTime?: string | number;
  StripReloadTime?: string | number;
  FirstSingleBulletTime?: string | number;
  BridgeDelay?: number;
  ReloadDelay?: number;
  PostReloadDelay?: number;
  StripClipSize?: string | number;
  ReloadLeft?: number | string;
  ReloadEmpty?: number | string;
  ReloadThrs?: number;
  NumBulletsReloaded?: string | number;
  ReloadSpeed?: number;
}

export interface WeaponDeploy {
  DeployTime: number;
  UnDeployTime: number;
}

export interface WeaponSpread {
  HIPStandBaseMin: number;
  HIPStandBaseMax: number;
  HIPStandMoveMin: number;
  HIPStandMoveMax: number;
  HIPCrouchBaseMin: number;
  HIPCrouchBaseMax: number;
  HIPProneBaseMin: number;
  ADSStandBaseMin: number;
  ADSStandBaseMax: number;
  ADSStandMoveMin: number;
  ADSStandMoveMax: number;
  ADSBaseSpreadInc: number;
  ADSRecoilDirection?: number;
  ADSRecoilAmount?: number;
  ADSRecoilDuration?: number;
  ADSRecoilDecreaseFactor?: number;
  HIPRecoilDirection?: number;
  HIPRecoilAmount?: number;
  [key: string]: any;
}

export interface WeaponRaw {
  codename: string;
  displayname: string;
  class: WeaponClass;
  velocity: number;
  rof: WeaponRoF;
  gravity: number;
  drag: number;
  mags: WeaponMags;
  pellets: number;
  ammo: string;
  reload: WeaponReload;
  deploy: WeaponDeploy;
  spread: WeaponSpread;
  damage: WeaponDamage;
}

export interface SimulationParams {
  targetHealth: number;
  hitMultiplier: number;
  pelletRatio: number;
  includeTravelTime: boolean;
  maxDistance: number;
}

export interface ComputedMetrics {
  closeDmg: number;
  farDmg: number;
  maxDmgRange: number;
  minDmgRange: number;
  closeBTK: number;
  farBTK: number;
  closeTTK: number;
  midTTK: number;
  longTTK: number;
  closeKPM: number;
  farKPM: number;
  magDamageClose: number;
  magDamageFar: number;
  dpsClose: number;
  dpsFar: number;
  tacticalReloadSeconds: number | null;
  emptyReloadSeconds: number | null;
}

export interface ProcessedWeapon extends WeaponRaw {
  id: string;
  classLabel: string;
  metrics: ComputedMetrics;
}

export interface DatasetInfo {
  version: string;
  versionDate: string;
}
