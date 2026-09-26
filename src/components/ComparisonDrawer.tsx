import React from 'react';
import { useWeapons } from '../context/WeaponContext';
import { COMPARISON_COLORS } from '../utils/constants';
import { Layers, X, Trash2, BookmarkCheck, ArrowRight } from 'lucide-react';

export const ComparisonDrawer: React.FC = () => {
  const {
    weapons,
    selectedWeaponIds,
    toggleWeaponComparison,
    selectWeaponsForComparison,
    clearComparisons,
    setInspectingWeapon
  } = useWeapons();

  const selectedWeapons = weapons.filter(w => selectedWeaponIds.includes(w.id));

  // Quick preset bundles
  const presets = [
    { label: 'Meta Rifles', ids: ['hk433', 'g3a4', 'm16a3', 'scarl'] },
    { label: 'CQC SMGs', ids: ['vector', 'scorpionevo3', 'mp7a2', 'p90'] },
    { label: 'LMG Firepower', ids: ['m60e6', 'minimi', 'mg4k', 'rpkm'] },
    { label: 'Precision Snipers', ids: ['m2010esr', 'l115a3', 'sv98m', 'deserttechhti'] },
  ];

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-chakra">
            Active Comparison Tray ({selectedWeapons.length}/8)
          </h2>
          <span className="text-[11px] text-slate-400">
            {selectedWeapons.length === 0 ? 'Select weapons from the table below to compare' : 'Weapons plotted in live charts'}
          </span>
        </div>

        {/* Quick presets and clear */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[11px] text-slate-500 font-mono hidden lg:inline">Presets:</span>
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => selectWeaponsForComparison(p.ids)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700/60 transition-colors flex items-center gap-1"
            >
              <BookmarkCheck className="w-3 h-3 text-cyan-400" />
              <span>{p.label}</span>
            </button>
          ))}

          {selectedWeapons.length > 0 && (
            <button
              onClick={clearComparisons}
              className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-[11px] font-medium border border-rose-800/50 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Weapon Cards / Chips */}
      {selectedWeapons.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-slate-800/80 rounded-lg">
          <p className="text-xs text-slate-400">
            No weapons currently selected. Click <span className="text-cyan-400 font-semibold">+ Compare</span> on any weapon in the roster below or pick a preset above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {selectedWeapons.map((weapon, idx) => {
            const color = COMPARISON_COLORS[idx % COMPARISON_COLORS.length];
            return (
              <div
                key={weapon.id}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-sm hover:border-slate-700 transition-all relative overflow-hidden group"
              >
                {/* Color strip on left */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: color }}
                />

                <div className="pl-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <h3
                      onClick={() => setInspectingWeapon(weapon)}
                      className="text-xs font-bold text-slate-200 truncate cursor-pointer hover:text-cyan-400 transition-colors"
                      title="Click to inspect weapon"
                    >
                      {weapon.displayname}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                    <span className="text-cyan-300 font-semibold">{weapon.metrics.closeTTK.toFixed(0)}ms</span>
                    <span>•</span>
                    <span>{weapon.rof.RoF.toFixed(0)} RPM</span>
                    <span>•</span>
                    <span>{weapon.mags.MagSize} rnds</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInspectingWeapon(weapon)}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                    title="Inspect weapon stats"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleWeaponComparison(weapon.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
