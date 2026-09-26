import React from 'react';
import { useWeapons } from '../context/WeaponContext';
import { WEAPON_CLASSES } from '../utils/constants';
import { WeaponClass } from '../types/weapon';
import { Search, X, CheckSquare } from 'lucide-react';

export const ClassFilterTabs: React.FC = () => {
  const {
    weapons,
    selectedClass,
    setSelectedClass,
    searchQuery,
    setSearchQuery,
    selectWeaponsForComparison,
  } = useWeapons();

  // Weapon counts per class
  const classCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: weapons.length };
    for (const w of weapons) {
      counts[w.class] = (counts[w.class] || 0) + 1;
    }
    return counts;
  }, [weapons]);

  const handleCompareClassTop = (cls: WeaponClass | 'all') => {
    const pool = cls === 'all' ? weapons : weapons.filter(w => w.class === cls);
    // Sort by close TTK and take top 4
    const top = [...pool].sort((a, b) => a.metrics.closeTTK - b.metrics.closeTTK).slice(0, 4);
    selectWeaponsForComparison(top.map(w => w.id));
  };

  return (
    <div className="space-y-3">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search weapon name, codename, ammo caliber..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick compare top in current filter */}
        <button
          onClick={() => handleCompareClassTop(selectedClass)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-cyan-300 transition-colors"
          title="Quickly select top TTK weapons in this category for comparison"
        >
          <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Compare Top in {selectedClass === 'all' ? 'All' : WEAPON_CLASSES[selectedClass]?.shortLabel || 'Class'}</span>
        </button>
      </div>

      {/* Class Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedClass('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedClass === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
          }`}
        >
          <span>All Classes</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            selectedClass === 'all' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}>
            {classCounts.all || 0}
          </span>
        </button>

        {(Object.keys(WEAPON_CLASSES) as WeaponClass[]).map((clsKey) => {
          const meta = WEAPON_CLASSES[clsKey];
          const isSelected = selectedClass === clsKey;
          const count = classCounts[clsKey] || 0;

          return (
            <button
              key={clsKey}
              onClick={() => setSelectedClass(clsKey)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'border-transparent shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border-slate-800'
              }`}
              style={{
                backgroundColor: isSelected ? meta.color : undefined,
                color: isSelected ? '#080d14' : undefined,
                boxShadow: isSelected ? `0 0 15px ${meta.color}33` : undefined,
              }}
            >
              <span>{meta.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isSelected ? 'bg-black/30 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
