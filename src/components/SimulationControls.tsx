import React from 'react';
import { useWeapons } from '../context/WeaponContext';
import {
  Heart,
  Target,
  Zap,
  Gauge,
  Sliders,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const { simulationParams, setSimulationParams } = useWeapons();

  const handleHealthChange = (health: number) => {
    setSimulationParams(prev => ({ ...prev, targetHealth: health }));
  };

  const handleMultiplierChange = (multiplier: number) => {
    setSimulationParams(prev => ({ ...prev, hitMultiplier: multiplier }));
  };

  const handlePelletChange = (ratio: number) => {
    setSimulationParams(prev => ({ ...prev, pelletRatio: ratio }));
  };

  const toggleTravelTime = () => {
    setSimulationParams(prev => ({ ...prev, includeTravelTime: !prev.includeTravelTime }));
  };

  const handleDistanceChange = (dist: number) => {
    setSimulationParams(prev => ({ ...prev, maxDistance: dist }));
  };

  const resetParams = () => {
    setSimulationParams({
      targetHealth: 100,
      hitMultiplier: 1.0,
      pelletRatio: 1.0,
      includeTravelTime: false,
      maxDistance: 100,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-chakra">
            Combat Simulation Parameters
          </h2>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            (Adjust target conditions & ballistics)
          </span>
        </div>
        <button
          onClick={resetParams}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors font-mono"
          title="Reset to standard defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        {/* 1. Target Health */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Target Health
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {simulationParams.targetHealth} HP
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="200"
            step="5"
            value={simulationParams.targetHealth}
            onChange={(e) => handleHealthChange(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex gap-1 pt-1">
            {[
              { label: '60 (HC)', val: 60 },
              { label: '100 (Std)', val: 100 },
              { label: '120 (Armor)', val: 120 },
            ].map(p => (
              <button
                key={p.val}
                onClick={() => handleHealthChange(p.val)}
                className={`flex-1 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  simulationParams.targetHealth === p.val
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Hit Location / Multiplier */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              Hit Location Multiplier
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {simulationParams.hitMultiplier.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.2"
            step="0.05"
            value={simulationParams.hitMultiplier}
            onChange={(e) => handleMultiplierChange(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex gap-1 pt-1">
            {[
              { label: 'Body (1.0x)', val: 1.0 },
              { label: 'Head (1.5x)', val: 1.5 },
              { label: 'Lethal (2.0x)', val: 2.0 },
            ].map(p => (
              <button
                key={p.val}
                onClick={() => handleMultiplierChange(p.val)}
                className={`flex-1 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  Math.abs(simulationParams.hitMultiplier - p.val) < 0.01
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Shotgun Pellet Hit Ratio */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              Shotgun Pellet Hits
            </span>
            <span className="font-mono text-orange-400 font-bold">
              {Math.round(simulationParams.pelletRatio * 16)}/16 ({Math.round(simulationParams.pelletRatio * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="0.0625"
            max="1.0"
            step="0.0625"
            value={simulationParams.pelletRatio}
            onChange={(e) => handlePelletChange(Number(e.target.value))}
            className="w-full accent-orange-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex gap-1 pt-1">
            {[
              { label: '100%', val: 1.0 },
              { label: '75%', val: 0.75 },
              { label: '50%', val: 0.5 },
              { label: '1 Pel', val: 0.0625 },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => handlePelletChange(p.val)}
                className={`flex-1 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  Math.abs(simulationParams.pelletRatio - p.val) < 0.02
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Travel Time Toggle */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Bullet Velocity Delay
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
              simulationParams.includeTravelTime
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                : 'bg-slate-800 text-slate-500'
            }`}>
              {simulationParams.includeTravelTime ? 'Active' : 'Off'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Adds ballistic bullet flight time (d / velocity) to TTK.
          </p>
          <button
            onClick={toggleTravelTime}
            className={`w-full py-1 rounded text-xs font-semibold transition-all ${
              simulationParams.includeTravelTime
                ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-md shadow-yellow-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {simulationParams.includeTravelTime ? 'Simulating Flight Time' : 'Engine Firing Only'}
          </button>
        </div>

        {/* 5. Max Graph Distance */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              Max Chart Distance
            </span>
            <span className="font-mono text-blue-400 font-bold">
              {simulationParams.maxDistance}m
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Graph horizontal range scale.
          </p>
          <div className="grid grid-cols-4 gap-1">
            {[50, 100, 150, 200].map(d => (
              <button
                key={d}
                onClick={() => handleDistanceChange(d)}
                className={`py-1 rounded text-[11px] font-mono transition-colors ${
                  simulationParams.maxDistance === d
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
