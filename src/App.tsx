import React from 'react';
import { WeaponProvider } from './context/WeaponContext';
import { Header } from './components/Header';
import { SimulationControls } from './components/SimulationControls';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { ChartsView } from './components/ChartsView';
import { HeadToHeadMatrix } from './components/HeadToHeadMatrix';
import { ClassFilterTabs } from './components/ClassFilterTabs';
import { WeaponsTable } from './components/WeaponsTable';
import { WeaponDetailModal } from './components/WeaponDetailModal';
import { Crosshair, ShieldCheck, Zap } from 'lucide-react';

const MainDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080d14] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Simulation Controls Dashboard */}
        <section>
          <SimulationControls />
        </section>

        {/* Comparison Manager Tray */}
        <section>
          <ComparisonDrawer />
        </section>

        {/* Charts & Graphs View */}
        <section>
          <ChartsView />
        </section>

        {/* Head-to-Head Comparison Matrix */}
        <section>
          <HeadToHeadMatrix />
        </section>

        {/* Filter Tabs & Search */}
        <section className="pt-2">
          <ClassFilterTabs />
        </section>

        {/* Master Weapons Table */}
        <section>
          <WeaponsTable />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0a0f18] py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span className="font-chakra font-bold text-slate-200">BF6 TTK Ballistics Lab</span>
              <span>•</span>
              <span>
                Data compiled by{' '}
                <a
                  href="https://sym.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                >
                  Sym.gg
                </a>
              </span>
            </div>

            <div className="flex items-center space-x-6 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Piecewise Linear Dropoff Model</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Real-Time Ballistics Engine</span>
              </span>
            </div>
          </div>

          {/* Legal Disclaimers & Attribution */}
          <div className="text-[11px] text-slate-400 space-y-2 leading-relaxed font-sans">
            <p>
              <strong className="text-slate-300 font-semibold">Data Attribution:</strong> Weapon statistics, fire rates, damage falloff curves, and raw mechanics data are sourced from{' '}
              <a
                href="https://sym.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 underline"
              >
                Sym.gg
              </a>
              . For the latest balance patches and official game data updates, please visit{' '}
              <a
                href="https://sym.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 underline"
              >
                sym.gg
              </a>
              .
            </p>
            <p>
              <strong className="text-slate-300 font-semibold">Legal Disclaimer:</strong> This website is an unofficial, non-commercial fan project created for educational, analytical, and community research purposes. Battlefield and related game titles, logos, and assets are trademarks or registered trademarks of Electronic Arts Inc. and DICE. This tool is not affiliated with, endorsed by, sponsored by, or associated with Electronic Arts Inc. or DICE in any way.
            </p>
          </div>
        </div>
      </footer>

      {/* Weapon Detail Modal */}
      <WeaponDetailModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <WeaponProvider>
      <MainDashboard />
    </WeaponProvider>
  );
};

export default App;
