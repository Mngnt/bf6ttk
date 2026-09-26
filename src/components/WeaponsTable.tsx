import React, { useState, useMemo } from 'react';
import { useWeapons } from '../context/WeaponContext';
import { ProcessedWeapon } from '../types/weapon';
import { WEAPON_CLASSES, COMPARISON_COLORS } from '../utils/constants';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Check,
  Info,
  Flame,
  Zap,
  Crosshair,
  Timer
} from 'lucide-react';

type SortColumn =
  | 'displayname'
  | 'class'
  | 'closeTTK'
  | 'midTTK'
  | 'longTTK'
  | 'rof'
  | 'magSize'
  | 'closeKPM'
  | 'farKPM'
  | 'closeDmg'
  | 'farDmg'
  | 'maxDmgRange'
  | 'velocity'
  | 'tacticalReload';

export const WeaponsTable: React.FC = () => {
  const {
    weapons,
    selectedClass,
    searchQuery,
    selectedWeaponIds,
    toggleWeaponComparison,
    setInspectingWeapon
  } = useWeapons();

  const [sortCol, setSortCol] = useState<SortColumn>('closeTTK');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter weapons by class & search
  const filteredWeapons = useMemo(() => {
    return weapons.filter(w => {
      // Class filter
      if (selectedClass !== 'all' && w.class !== selectedClass) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = w.displayname.toLowerCase().includes(q);
        const matchesCode = w.codename.toLowerCase().includes(q);
        const matchesAmmo = w.ammo.toLowerCase().includes(q);
        const matchesClass = w.class.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesAmmo && !matchesClass) return false;
      }
      return true;
    });
  }, [weapons, selectedClass, searchQuery]);

  // Sort weapons
  const sortedWeapons = useMemo(() => {
    return [...filteredWeapons].sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortCol) {
        case 'displayname':
          valA = a.displayname;
          valB = b.displayname;
          break;
        case 'class':
          valA = a.class;
          valB = b.class;
          break;
        case 'closeTTK':
          valA = a.metrics.closeTTK;
          valB = b.metrics.closeTTK;
          break;
        case 'midTTK':
          valA = a.metrics.midTTK;
          valB = b.metrics.midTTK;
          break;
        case 'longTTK':
          valA = a.metrics.longTTK;
          valB = b.metrics.longTTK;
          break;
        case 'rof':
          valA = a.rof.RoF;
          valB = b.rof.RoF;
          break;
        case 'magSize':
          valA = a.mags.MagSize;
          valB = b.mags.MagSize;
          break;
        case 'closeKPM':
          valA = a.metrics.closeKPM;
          valB = b.metrics.closeKPM;
          break;
        case 'farKPM':
          valA = a.metrics.farKPM;
          valB = b.metrics.farKPM;
          break;
        case 'closeDmg':
          valA = a.metrics.closeDmg;
          valB = b.metrics.closeDmg;
          break;
        case 'farDmg':
          valA = a.metrics.farDmg;
          valB = b.metrics.farDmg;
          break;
        case 'maxDmgRange':
          valA = a.metrics.maxDmgRange;
          valB = b.metrics.maxDmgRange;
          break;
        case 'velocity':
          valA = a.velocity;
          valB = b.velocity;
          break;
        case 'tacticalReload':
          valA = a.metrics.tacticalReloadSeconds ?? 999;
          valB = b.metrics.tacticalReloadSeconds ?? 999;
          break;
        default:
          valA = a.metrics.closeTTK;
          valB = b.metrics.closeTTK;
      }

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [filteredWeapons, sortCol, sortAsc]);

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      // For TTK or reload, ascending is better (faster); for RoF/Mag/Dmg, descending is better (higher)
      const defaultAsc = ['closeTTK', 'midTTK', 'longTTK', 'tacticalReload', 'displayname', 'class'].includes(col);
      setSortAsc(defaultAsc);
    }
  };

  const renderSortIcon = (col: SortColumn) => {
    if (sortCol !== col) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />;
    }
    return sortAsc
      ? <ArrowUp className="w-3 h-3 text-cyan-400" />
      : <ArrowDown className="w-3 h-3 text-cyan-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Table header bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-chakra flex items-center gap-2">
            <span>Weapon Database Matrix</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({sortedWeapons.length} matching)
            </span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click column headers to sort. Select checkboxes to compare curves in real-time.
          </p>
        </div>

        {/* Quick legend / indicator */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>&lt;200ms TTK (Top Tier)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>200-300ms</span>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[640px] scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#0b1019] text-slate-400 font-semibold sticky top-0 z-20 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">Compare</th>
              <th
                onClick={() => handleSort('displayname')}
                className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>Weapon</span>
                  {renderSortIcon('displayname')}
                </div>
              </th>
              <th
                onClick={() => handleSort('class')}
                className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <span>Class</span>
                  {renderSortIcon('class')}
                </div>
              </th>
              <th
                onClick={() => handleSort('closeTTK')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Close TTK (10m)</span>
                  {renderSortIcon('closeTTK')}
                </div>
              </th>
              <th
                onClick={() => handleSort('midTTK')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Mid TTK (45m)</span>
                  {renderSortIcon('midTTK')}
                </div>
              </th>
              <th
                onClick={() => handleSort('longTTK')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Long TTK (85m)</span>
                  {renderSortIcon('longTTK')}
                </div>
              </th>
              <th
                onClick={() => handleSort('rof')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>RoF (RPM)</span>
                  {renderSortIcon('rof')}
                </div>
              </th>
              <th
                onClick={() => handleSort('magSize')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Mag</span>
                  {renderSortIcon('magSize')}
                </div>
              </th>
              <th
                onClick={() => handleSort('closeKPM')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Kills/Mag</span>
                  {renderSortIcon('closeKPM')}
                </div>
              </th>
              <th
                onClick={() => handleSort('maxDmgRange')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Max Dmg Range</span>
                  {renderSortIcon('maxDmgRange')}
                </div>
              </th>
              <th
                onClick={() => handleSort('velocity')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Velocity</span>
                  {renderSortIcon('velocity')}
                </div>
              </th>
              <th
                onClick={() => handleSort('tacticalReload')}
                className="py-2.5 px-3 cursor-pointer hover:text-cyan-400 transition-colors group text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Reload (Tac)</span>
                  {renderSortIcon('tacticalReload')}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {sortedWeapons.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-8 text-center text-slate-500 font-sans">
                  No weapons found matching your search and filter criteria.
                </td>
              </tr>
            ) : (
              sortedWeapons.map((weapon) => {
                const isSelected = selectedWeaponIds.includes(weapon.id);
                const classMeta = WEAPON_CLASSES[weapon.class];
                const selectedIndex = selectedWeaponIds.indexOf(weapon.id);
                const compColor = selectedIndex >= 0 ? COMPARISON_COLORS[selectedIndex % COMPARISON_COLORS.length] : null;

                // Color code for Close TTK
                const ttk = weapon.metrics.closeTTK;
                let ttkColor = 'text-slate-300';
                if (ttk <= 200) ttkColor = 'text-emerald-400 font-bold';
                else if (ttk <= 250) ttkColor = 'text-cyan-300 font-medium';
                else if (ttk <= 320) ttkColor = 'text-amber-300';
                else ttkColor = 'text-rose-300';

                return (
                  <tr
                    key={weapon.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    {/* Compare Checkbox / Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => toggleWeaponComparison(weapon.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          isSelected
                            ? 'shadow-sm text-slate-950'
                            : 'border border-slate-700 bg-slate-900 text-transparent hover:border-cyan-400 hover:text-slate-500'
                        }`}
                        style={{
                          backgroundColor: isSelected ? (compColor || '#00f0ff') : undefined,
                        }}
                        title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </td>

                    {/* Weapon Name */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        {compColor && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: compColor }}
                          />
                        )}
                        <div>
                          <div
                            onClick={() => setInspectingWeapon(weapon)}
                            className="font-bold font-chakra text-slate-200 hover:text-cyan-400 cursor-pointer transition-colors text-sm"
                          >
                            {weapon.displayname}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {weapon.codename} • {weapon.ammo}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-sans px-2 py-0.5 rounded border ${classMeta?.badgeBg || 'bg-slate-800 text-slate-400'}`}>
                        {weapon.classLabel}
                      </span>
                    </td>

                    {/* Close TTK */}
                    <td className="py-2.5 px-3 text-right">
                      <span className={ttkColor}>
                        {weapon.metrics.closeTTK.toFixed(0)} ms
                      </span>
                    </td>

                    {/* Mid TTK */}
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {weapon.metrics.midTTK.toFixed(0)} ms
                    </td>

                    {/* Long TTK */}
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {weapon.metrics.longTTK.toFixed(0)} ms
                    </td>

                    {/* RoF */}
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      {weapon.rof.RoF.toFixed(0)}
                    </td>

                    {/* Mag Size */}
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      {weapon.mags.MagSize}
                    </td>

                    {/* Kills Per Mag */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-cyan-300 font-semibold">
                        {weapon.metrics.closeKPM.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">
                        ({weapon.metrics.farKPM.toFixed(1)})
                      </span>
                    </td>

                    {/* Max Dmg Range */}
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {weapon.metrics.maxDmgRange}m
                    </td>

                    {/* Velocity */}
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {weapon.velocity} m/s
                    </td>

                    {/* Tactical Reload */}
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {weapon.metrics.tacticalReloadSeconds ? `${weapon.metrics.tacticalReloadSeconds.toFixed(2)}s` : 'N/A'}
                    </td>

                    {/* Inspect Button */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setInspectingWeapon(weapon)}
                        className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="Deep Inspect Weapon Data"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
