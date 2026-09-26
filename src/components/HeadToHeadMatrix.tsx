import React from 'react';
import { useWeapons } from '../context/WeaponContext';
import { COMPARISON_COLORS, WEAPON_CLASSES } from '../utils/constants';
import { Award, ArrowRight, Zap, Target } from 'lucide-react';

export const HeadToHeadMatrix: React.FC = () => {
  const { weapons, selectedWeaponIds, setInspectingWeapon } = useWeapons();

  const selectedWeapons = weapons.filter(w => selectedWeaponIds.includes(w.id));

  if (selectedWeapons.length < 2) {
    return null;
  }

  // Row definition helper
  interface MetricRow {
    label: string;
    description: string;
    getValue: (w: typeof selectedWeapons[0]) => number | string;
    formatValue: (w: typeof selectedWeapons[0]) => string;
    best: 'min' | 'max' | 'none';
  }

  const rows: MetricRow[] = [
    {
      label: 'Close TTK (10m)',
      description: 'Lethality at point blank range',
      getValue: (w) => w.metrics.closeTTK,
      formatValue: (w) => `${w.metrics.closeTTK.toFixed(0)} ms`,
      best: 'min',
    },
    {
      label: 'Mid TTK (45m)',
      description: 'Medium distance engagement speed',
      getValue: (w) => w.metrics.midTTK,
      formatValue: (w) => `${w.metrics.midTTK.toFixed(0)} ms`,
      best: 'min',
    },
    {
      label: 'Long TTK (85m)',
      description: 'Sustained long distance lethality',
      getValue: (w) => w.metrics.longTTK,
      formatValue: (w) => `${w.metrics.longTTK.toFixed(0)} ms`,
      best: 'min',
    },
    {
      label: 'Fire Rate (RoF)',
      description: 'Rounds per minute',
      getValue: (w) => w.rof.RoF,
      formatValue: (w) => `${w.rof.RoF.toFixed(0)} RPM`,
      best: 'max',
    },
    {
      label: 'Magazine Capacity',
      description: 'Rounds per full magazine',
      getValue: (w) => w.mags.MagSize,
      formatValue: (w) => `${w.mags.MagSize} rnds`,
      best: 'max',
    },
    {
      label: 'Kills Per Mag (Close)',
      description: 'Enemies downable per mag at 10m',
      getValue: (w) => w.metrics.closeKPM,
      formatValue: (w) => `${w.metrics.closeKPM.toFixed(1)} kills`,
      best: 'max',
    },
    {
      label: 'Kills Per Mag (Far)',
      description: 'Enemies downable per mag at 85m',
      getValue: (w) => w.metrics.farKPM,
      formatValue: (w) => `${w.metrics.farKPM.toFixed(1)} kills`,
      best: 'max',
    },
    {
      label: 'Max Damage',
      description: 'Peak base damage per bullet/shot',
      getValue: (w) => w.metrics.closeDmg,
      formatValue: (w) => `${w.metrics.closeDmg.toFixed(1)} dmg`,
      best: 'max',
    },
    {
      label: 'Min Damage',
      description: 'Damage floor at maximum range',
      getValue: (w) => w.metrics.farDmg,
      formatValue: (w) => `${w.metrics.farDmg.toFixed(1)} dmg`,
      best: 'max',
    },
    {
      label: 'Max Damage Range',
      description: 'Distance before damage starts dropping',
      getValue: (w) => w.metrics.maxDmgRange,
      formatValue: (w) => `${w.metrics.maxDmgRange}m`,
      best: 'max',
    },
    {
      label: 'Muzzle Velocity',
      description: 'Bullet speed (less lead & bullet drop)',
      getValue: (w) => w.velocity,
      formatValue: (w) => `${w.velocity} m/s`,
      best: 'max',
    },
    {
      label: 'Tactical Reload',
      description: 'Reload speed with rounds left in chamber',
      getValue: (w) => w.metrics.tacticalReloadSeconds ?? 999,
      formatValue: (w) => w.metrics.tacticalReloadSeconds ? `${w.metrics.tacticalReloadSeconds.toFixed(2)}s` : 'N/A',
      best: 'min',
    },
    {
      label: 'Empty Reload',
      description: 'Full reload speed on empty chamber',
      getValue: (w) => w.metrics.emptyReloadSeconds ?? 999,
      formatValue: (w) => w.metrics.emptyReloadSeconds ? `${w.metrics.emptyReloadSeconds.toFixed(2)}s` : 'N/A',
      best: 'min',
    },
    {
      label: 'Deploy Time',
      description: 'Weapon draw speed from holster/sprint',
      getValue: (w) => w.deploy.DeployTime,
      formatValue: (w) => `${w.deploy.DeployTime.toFixed(2)}s`,
      best: 'min',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-chakra">
            Head-to-Head Stat Comparison
          </h2>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            (Winning values highlighted in green)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="py-2.5 px-3 text-slate-400 font-medium w-48 bg-slate-950/40">
                Specification
              </th>
              {selectedWeapons.map((w, idx) => {
                const color = COMPARISON_COLORS[idx % COMPARISON_COLORS.length];
                const classMeta = WEAPON_CLASSES[w.class];
                return (
                  <th key={w.id} className="py-2.5 px-3 min-w-[140px] text-slate-200 font-chakra">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-bold text-sm truncate">{w.displayname}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${classMeta?.badgeBg || 'bg-slate-800 text-slate-400'}`}>
                        {w.classLabel}
                      </span>
                      <button
                        onClick={() => setInspectingWeapon(w)}
                        className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center gap-0.5"
                      >
                        Inspect <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {rows.map((row) => {
              // Find winning value
              let bestVal: number | null = null;
              if (row.best !== 'none') {
                const numericVals = selectedWeapons
                  .map(w => Number(row.getValue(w)))
                  .filter(v => !isNaN(v) && v !== 999);

                if (numericVals.length > 0) {
                  bestVal = row.best === 'min' ? Math.min(...numericVals) : Math.max(...numericVals);
                }
              }

              return (
                <tr key={row.label} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2 px-3 text-slate-400 font-sans text-xs bg-slate-950/20">
                    <div className="font-medium text-slate-300">{row.label}</div>
                    <div className="text-[10px] text-slate-500">{row.description}</div>
                  </td>
                  {selectedWeapons.map((w) => {
                    const rawVal = Number(row.getValue(w));
                    const isWinner = bestVal !== null && rawVal === bestVal && selectedWeapons.length > 1;

                    return (
                      <td
                        key={w.id}
                        className={`py-2 px-3 text-xs ${
                          isWinner
                            ? 'text-emerald-400 font-bold bg-emerald-950/20'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {isWinner && <Zap className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                          <span>{row.formatValue(w)}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
