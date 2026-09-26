import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  ChartOptions
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import { useWeapons, ChartType } from '../context/WeaponContext';
import { COMPARISON_COLORS } from '../utils/constants';
import {
  getTTK,
  getDamageAtDistance,
  getBTK,
  getKillsPerMag,
  getDPS
} from '../utils/ballistics';
import {
  Timer,
  Activity,
  Crosshair,
  ShieldAlert,
  Flame,
  Radar as RadarIcon
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

export const ChartsView: React.FC = () => {
  const {
    weapons,
    selectedWeaponIds,
    simulationParams,
    activeChartType,
    setActiveChartType
  } = useWeapons();

  const selectedWeapons = useMemo(() => {
    return weapons.filter(w => selectedWeaponIds.includes(w.id));
  }, [weapons, selectedWeaponIds]);

  // Distance marks: every 1m up to maxDistance
  const distanceLabels = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i <= simulationParams.maxDistance; i += 1) {
      arr.push(i);
    }
    return arr;
  }, [simulationParams.maxDistance]);

  // Chart datasets
  const chartData = useMemo(() => {
    if (selectedWeapons.length === 0) {
      return { labels: [], datasets: [] };
    }

    if (activeChartType === 'radar') {
      // Radar Chart: normalize metrics on 0-100 scale for comparison
      const metricsLabels = [
        'Close TTK (Low ms)',
        'Mid TTK (Low ms)',
        'Fire Rate (RPM)',
        'Mag Capacity',
        'Bullet Velocity',
        'Reload Agility'
      ];

      const datasets = selectedWeapons.map((weapon, idx) => {
        const color = COMPARISON_COLORS[idx % COMPARISON_COLORS.length];

        // Normalization formulas (clamped 0 - 100)
        // TTK: lower is better (0ms -> 100, 500ms+ -> 0)
        const closeScore = Math.max(0, Math.min(100, (500 - weapon.metrics.closeTTK) / 5));
        const midScore = Math.max(0, Math.min(100, (600 - weapon.metrics.midTTK) / 6));
        // RPM: 300 -> 30, 1100 -> 100
        const rofScore = Math.max(10, Math.min(100, (weapon.rof.RoF / 1100) * 100));
        // Mag: 10 -> 20, 100+ -> 100
        const magScore = Math.max(10, Math.min(100, (weapon.mags.MagSize / 100) * 100));
        // Velocity: 300 -> 30, 900+ -> 100
        const velScore = Math.max(10, Math.min(100, (weapon.velocity / 900) * 100));
        // Reload: faster reload = higher score (1.5s -> 95, 5s+ -> 15)
        const reloadSec = weapon.metrics.tacticalReloadSeconds || 3.0;
        const reloadScore = Math.max(10, Math.min(100, ((6 - reloadSec) / 5) * 100));

        return {
          label: weapon.displayname,
          data: [closeScore, midScore, rofScore, magScore, velScore, reloadScore],
          backgroundColor: `${color}25`,
          borderColor: color,
          borderWidth: 2,
          pointBackgroundColor: color,
          pointBorderColor: '#0b0f17',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: color,
        };
      });

      return { labels: metricsLabels, datasets };
    }

    // Line Charts for TTK, Damage, BTK, KPM, DPS
    const datasets = selectedWeapons.map((weapon, idx) => {
      const color = COMPARISON_COLORS[idx % COMPARISON_COLORS.length];
      const data: number[] = [];

      for (const d of distanceLabels) {
        if (activeChartType === 'ttk') {
          data.push(getTTK(weapon, d, simulationParams));
        } else if (activeChartType === 'damage') {
          const dmg = getDamageAtDistance(
            weapon,
            d,
            simulationParams.hitMultiplier,
            simulationParams.pelletRatio
          );
          data.push(Math.round(dmg * 10) / 10);
        } else if (activeChartType === 'btk') {
          const btk = getBTK(
            weapon,
            d,
            simulationParams.targetHealth,
            simulationParams.hitMultiplier,
            simulationParams.pelletRatio
          );
          data.push(btk);
        } else if (activeChartType === 'kpm') {
          const kpm = getKillsPerMag(
            weapon,
            d,
            simulationParams.targetHealth,
            simulationParams.hitMultiplier,
            simulationParams.pelletRatio
          );
          data.push(kpm.exact);
        } else if (activeChartType === 'dps') {
          const dps = getDPS(
            weapon,
            d,
            simulationParams.hitMultiplier,
            simulationParams.pelletRatio
          );
          data.push(dps);
        }
      }

      return {
        label: `${weapon.displayname} (${weapon.classLabel})`,
        data,
        borderColor: color,
        backgroundColor: `${color}15`,
        borderWidth: 2.2,
        tension: 0, // stepped or crisp angles
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#ffffff',
        fill: false,
        stepped: activeChartType === 'ttk' || activeChartType === 'btk' ? 'before' as const : false,
      };
    });

    return {
      labels: distanceLabels.map(d => `${d}m`),
      datasets
    };
  }, [selectedWeapons, distanceLabels, activeChartType, simulationParams]);

  // Chart configuration options
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 11, weight: 'bold' },
          boxWidth: 14,
          boxHeight: 6,
          usePointStyle: false,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(11, 16, 26, 0.95)',
        titleColor: '#00f0ff',
        titleFont: { family: 'Chakra Petch', size: 13, weight: 'bold' },
        bodyColor: '#e2e8f0',
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        borderColor: '#1e293b',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (items) => `Distance: ${items[0].label}`,
          label: (item) => {
            const val = item.parsed.y;
            if (activeChartType === 'ttk') return ` ${item.dataset.label}: ${val} ms`;
            if (activeChartType === 'damage') return ` ${item.dataset.label}: ${val} dmg`;
            if (activeChartType === 'btk') return ` ${item.dataset.label}: ${val} bullets to kill`;
            if (activeChartType === 'kpm') return ` ${item.dataset.label}: ${val} kills/mag`;
            if (activeChartType === 'dps') return ` ${item.dataset.label}: ${val} DPS`;
            return ` ${item.dataset.label}: ${val}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(30, 41, 59, 0.4)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 10 },
          maxTicksLimit: 16,
        },
        title: {
          display: true,
          text: 'Engagement Distance (Meters)',
          color: '#94a3b8',
          font: { family: 'Chakra Petch', size: 11, weight: 'bold' }
        }
      },
      y: {
        grid: { color: 'rgba(30, 41, 59, 0.4)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 10 },
        },
        title: {
          display: true,
          text:
            activeChartType === 'ttk' ? 'Time to Kill (ms) - Lower is Faster' :
            activeChartType === 'damage' ? 'Damage Output (HP)' :
            activeChartType === 'btk' ? 'Bullets to Kill (BTK)' :
            activeChartType === 'kpm' ? 'Kills Per Magazine' : 'Damage Per Second (DPS)',
          color: '#00f0ff',
          font: { family: 'Chakra Petch', size: 11, weight: 'bold' }
        }
      }
    }
  };

  const radarOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 11, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(11, 16, 26, 0.95)',
        borderColor: '#1e293b',
        borderWidth: 1,
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(51, 65, 85, 0.5)' },
        grid: { color: 'rgba(30, 41, 59, 0.6)' },
        pointLabels: {
          color: '#94a3b8',
          font: { family: 'Chakra Petch', size: 11, weight: 'bold' }
        },
        ticks: {
          display: false,
          maxTicksLimit: 5,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      }
    }
  };

  const chartTabs: { type: ChartType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: 'ttk', label: 'Time to Kill', icon: <Timer className="w-3.5 h-3.5" />, desc: 'Milliseconds to eliminate target (Lower is faster)' },
    { type: 'damage', label: 'Damage Falloff', icon: <Flame className="w-3.5 h-3.5" />, desc: 'Bullet damage per shot across distance' },
    { type: 'btk', label: 'Bullets to Kill', icon: <ShieldAlert className="w-3.5 h-3.5" />, desc: 'Shots required to down 100 HP target' },
    { type: 'kpm', label: 'Kills Per Mag', icon: <Crosshair className="w-3.5 h-3.5" />, desc: 'Theoretical kills with a full magazine' },
    { type: 'dps', label: 'DPS Output', icon: <Activity className="w-3.5 h-3.5" />, desc: 'Damage output per second (Damage * RoF / 60)' },
    { type: 'radar', label: 'Radar Profile', icon: <RadarIcon className="w-3.5 h-3.5" />, desc: 'All-around radar polygon comparison' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Chart Nav Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {chartTabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveChartType(tab.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeChartType === tab.type
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>{chartTabs.find(t => t.type === activeChartType)?.desc}</span>
        </div>
      </div>

      {/* Chart Render Area */}
      <div className="h-[360px] sm:h-[420px] w-full relative">
        {selectedWeapons.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
            <Timer className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-slate-300 font-chakra">
              No Weapons Selected for Graph
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select 1 to 8 weapons from the table below to plot ballistic curves, compare TTK dropoffs, and analyze range effectiveness.
            </p>
          </div>
        ) : activeChartType === 'radar' ? (
          <Radar data={chartData as any} options={radarOptions} />
        ) : (
          <Line data={chartData as any} options={lineOptions} />
        )}
      </div>
    </div>
  );
};
