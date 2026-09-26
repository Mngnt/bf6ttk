import React from 'react';
import { useWeapons } from '../context/WeaponContext';
import { WEAPON_CLASSES, COMPARISON_COLORS } from '../utils/constants';
import {
  X,
  Plus,
  Check,
  Zap,
  Target,
  Timer,
  Shield,
  Gauge,
  RotateCw,
  Crosshair,
  Layers
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

export const WeaponDetailModal: React.FC = () => {
  const {
    inspectingWeapon,
    setInspectingWeapon,
    selectedWeaponIds,
    toggleWeaponComparison,
    simulationParams
  } = useWeapons();

  if (!inspectingWeapon) return null;

  const w = inspectingWeapon;
  const isCompared = selectedWeaponIds.includes(w.id);
  const classMeta = WEAPON_CLASSES[w.class];

  // Generate distance points for individual weapon curve
  const distPoints: number[] = [];
  const maxD = Math.max(100, Math.ceil(w.damage.dists[w.damage.dists.length - 1] * 1.2));
  for (let d = 0; d <= maxD; d += 2) {
    distPoints.push(d);
  }

  // Calculate damage values
  const dmgValues = distPoints.map(d => {
    const { dmgs, dists } = w.damage;
    if (d <= dists[0]) return dmgs[0];
    if (d >= dists[dists.length - 1]) return dmgs[dmgs.length - 1];
    for (let i = 0; i < dists.length - 1; i++) {
      if (d >= dists[i] && d <= dists[i + 1]) {
        if (dists[i] === dists[i + 1]) return d === dists[i] ? dmgs[i + 1] : dmgs[i];
        const t = (d - dists[i]) / (dists[i + 1] - dists[i]);
        return dmgs[i] + t * (dmgs[i + 1] - dmgs[i]);
      }
    }
    return dmgs[dmgs.length - 1];
  });

  const miniChartData = {
    labels: distPoints.map(d => `${d}m`),
    datasets: [
      {
        label: 'Base Bullet Damage',
        data: dmgValues,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        tension: 0,
      }
    ]
  };

  const miniChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(11, 16, 26, 0.95)',
        titleColor: '#00f0ff',
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        callbacks: {
          label: (item: any) => ` Damage: ${item.parsed.y.toFixed(1)} HP`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(30, 41, 59, 0.3)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 8 },
        title: { display: true, text: 'Distance (Meters)', color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(30, 41, 59, 0.3)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 9 } },
        title: { display: true, text: 'Damage (HP)', color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-chakra text-white">
                  {w.displayname}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-sans ${classMeta?.badgeBg || 'bg-slate-800'}`}>
                  {classMeta?.label || w.class}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>Codename: <span className="text-slate-300 font-semibold">{w.codename}</span></span>
                <span>•</span>
                <span>Caliber: <span className="text-slate-300">{w.ammo}</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWeaponComparison(w.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isCompared
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'Compared' : 'Add to Compare'}</span>
            </button>
            <button
              onClick={() => setInspectingWeapon(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Close TTK (10m)</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {w.metrics.closeTTK.toFixed(0)} ms
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                {w.metrics.closeBTK} Bullets to Kill
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Fire Rate (RoF)</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {w.rof.RoF.toFixed(0)} RPM
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                {(60 / w.rof.RoF * 1000).toFixed(1)}ms cycle
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Mag Capacity</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {w.mags.MagSize} rnds
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                {w.metrics.closeKPM.toFixed(1)} Kills/Mag
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <span className="text-slate-400 text-[11px] block">Muzzle Velocity</span>
              <span className="text-lg font-bold font-mono text-sky-400">
                {w.velocity} m/s
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                Drag: {w.drag}
              </span>
            </div>
          </div>

          {/* Damage Falloff Chart */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-chakra font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Damage Falloff Profile</span>
              </h3>
              <span className="font-mono text-[10px] text-slate-400">
                Max: {w.metrics.closeDmg.toFixed(1)} HP (0-{w.metrics.maxDmgRange}m) → Min: {w.metrics.farDmg.toFixed(1)} HP (&gt;{w.metrics.minDmgRange}m)
              </span>
            </div>
            <div className="h-44 w-full">
              <Line data={miniChartData} options={miniChartOptions} />
            </div>
          </div>

          {/* Stats Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reload & Handling */}
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
              <h4 className="font-chakra font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                Reload & Handling
              </h4>
              <div className="divide-y divide-slate-800/80 font-mono text-xs">
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">Tactical Reload (Left):</span>
                  <span>{w.metrics.tacticalReloadSeconds ? `${w.metrics.tacticalReloadSeconds.toFixed(2)}s` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">Empty Reload:</span>
                  <span>{w.metrics.emptyReloadSeconds ? `${w.metrics.emptyReloadSeconds.toFixed(2)}s` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">Reload Threshold:</span>
                  <span>{w.reload.ReloadThrs ? `${(w.reload.ReloadThrs * 100).toFixed(0)}%` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">Deploy Time:</span>
                  <span>{w.deploy.DeployTime.toFixed(2)}s</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">Undeploy Time:</span>
                  <span>{w.deploy.UnDeployTime.toFixed(2)}s</span>
                </div>
              </div>
            </div>

            {/* Recoil & Spread */}
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
              <h4 className="font-chakra font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Spread & Recoil Dynamics
              </h4>
              <div className="divide-y divide-slate-800/80 font-mono text-xs">
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">ADS Stand Base Min:</span>
                  <span>{w.spread.ADSStandBaseMin ?? 'N/A'}°</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">ADS Move Spread:</span>
                  <span>{w.spread.ADSStandMoveMin ?? 'N/A'}°</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">Hipfire Stand Base:</span>
                  <span>{w.spread.HIPStandBaseMin ?? 'N/A'}°</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">ADS Recoil Amount:</span>
                  <span>{w.spread.ADSRecoilAmount ? `${w.spread.ADSRecoilAmount.toFixed(4)}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5 text-slate-300">
                  <span className="text-slate-400 font-sans">ADS Recoil Angle:</span>
                  <span>{w.spread.ADSRecoilDirection ? `${w.spread.ADSRecoilDirection}°` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setInspectingWeapon(null)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
