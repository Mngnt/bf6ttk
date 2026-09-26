import React, { useState } from 'react';
import { useWeapons } from '../context/WeaponContext';
import { exportWeaponsToCsv } from '../utils/weaponStats';
import {
  Crosshair,
  RefreshCw,
  Download,
  Upload,
  Globe,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    weapons,
    datasetInfo,
    selectedWeaponIds,
    isLoading,
    error,
    fetchLiveDataset,
    resetToBundledDataset,
  } = useWeapons();

  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('https://sym.gg/legacy/pages/bf6/data/bf6.json');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleFetch = async () => {
    await fetchLiveDataset(customUrl);
    setShowUrlModal(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (typeof json === 'object') {
          // If valid json, we can trigger fetch via object url or update context
          const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          fetchLiveDataset(url);
          setSyncSuccess(true);
          setTimeout(() => setSyncSuccess(false), 4000);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="border-b border-slate-800 bg-[#0c121e]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Crosshair className="h-5 w-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-wider uppercase text-white font-chakra">
                  BF6 Ballistics Lab
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold tracking-wide">
                  v{datasetInfo?.version || '1.4.2.0'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  {datasetInfo?.versionDate || '18 AUG 2026'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Sym.gg Weapon Database</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                <span>TTK & Range Analyzer</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="hidden lg:flex items-center space-x-4 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{weapons.length} Weapons</span>
              </div>
              <div className="h-3 w-px bg-slate-800"></div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedWeaponIds.length} Compared</span>
              </div>
            </div>

            {/* Sync live status */}
            {syncSuccess && (
              <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1.5 rounded-lg animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synced</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-1 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 px-2.5 py-1.5 rounded-lg" title={error}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">Live fetch failed</span>
              </div>
            )}

            {/* Sync Live Button */}
            <button
              onClick={() => setShowUrlModal(true)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              title="Sync or customize Sym.gg data URL"
            >
              <Globe className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Data Source</span>
            </button>

            {/* Upload File */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Load JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Export CSV */}
            <button
              onClick={() => exportWeaponsToCsv(weapons)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-semibold text-white shadow-sm transition-all"
              title="Export all weapon ballistics data to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-chakra flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Data Source Configuration
              </h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fetch real-time data directly from the official Sym.gg API endpoint or provide an alternative mirror:
            </p>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">JSON Endpoint URL</label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={resetToBundledDataset}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Reset to bundled data
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-slate-950 flex items-center gap-1.5"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Fetch & Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
