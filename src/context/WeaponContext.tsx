import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ProcessedWeapon, SimulationParams, DatasetInfo, WeaponClass } from '../types/weapon';
import { parseDataset, getDefaultDataset } from '../utils/weaponStats';
import rawDataJson from '../data/bf6.json';

export type ChartType = 'ttk' | 'damage' | 'btk' | 'kpm' | 'dps' | 'radar';

interface WeaponContextType {
  weapons: ProcessedWeapon[];
  datasetInfo: DatasetInfo;
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  selectedClass: WeaponClass | 'all';
  setSelectedClass: (cls: WeaponClass | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWeaponIds: string[];
  toggleWeaponComparison: (id: string) => void;
  selectWeaponsForComparison: (ids: string[]) => void;
  clearComparisons: () => void;
  activeChartType: ChartType;
  setActiveChartType: (chart: ChartType) => void;
  inspectingWeapon: ProcessedWeapon | null;
  setInspectingWeapon: (weapon: ProcessedWeapon | null) => void;
  isLoading: boolean;
  error: string | null;
  fetchLiveDataset: (url?: string) => Promise<void>;
  resetToBundledDataset: () => void;
}

const defaultParams: SimulationParams = {
  targetHealth: 100,
  hitMultiplier: 1.0,
  pelletRatio: 1.0,
  includeTravelTime: false,
  maxDistance: 100,
};

const WeaponContext = createContext<WeaponContextType | undefined>(undefined);

export const WeaponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rawData, setRawData] = useState<Record<string, any>>(rawDataJson);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(defaultParams);
  const [selectedClass, setSelectedClass] = useState<WeaponClass | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Start with 3 distinct representative weapons selected for immediate comparison
  const [selectedWeaponIds, setSelectedWeaponIds] = useState<string[]>(['hk433', 'g3a4', 'vector']);
  const [activeChartType, setActiveChartType] = useState<ChartType>('ttk');
  const [inspectingWeapon, setInspectingWeapon] = useState<ProcessedWeapon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Re-compute weapon metrics whenever simulation parameters or rawData changes
  const { weapons, datasetInfo } = useMemo(() => {
    try {
      return parseDataset(rawData, simulationParams);
    } catch (e) {
      console.error('Failed to parse dataset:', e);
      return getDefaultDataset(simulationParams);
    }
  }, [rawData, simulationParams]);

  // Keep inspecting weapon updated with fresh metrics if modal is open
  useEffect(() => {
    if (inspectingWeapon) {
      const updated = weapons.find(w => w.id === inspectingWeapon.id);
      if (updated) setInspectingWeapon(updated);
    }
  }, [weapons]);

  const toggleWeaponComparison = (id: string) => {
    setSelectedWeaponIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        // limit comparison to up to 8 weapons for chart readability
        if (prev.length >= 8) {
          return [...prev.slice(1), id];
        }
        return [...prev, id];
      }
    });
  };

  const selectWeaponsForComparison = (ids: string[]) => {
    setSelectedWeaponIds(ids.slice(0, 8));
  };

  const clearComparisons = () => {
    setSelectedWeaponIds([]);
  };

  const fetchLiveDataset = async (url: string = 'https://sym.gg/legacy/pages/bf6/data/bf6.json') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setRawData(data);
    } catch (err: any) {
      console.error('Failed to fetch live data:', err);
      setError(err?.message || 'Failed to fetch live dataset. Reverting to cached data.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToBundledDataset = () => {
    setRawData(rawDataJson);
    setError(null);
  };

  return (
    <WeaponContext.Provider
      value={{
        weapons,
        datasetInfo: datasetInfo || { version: '1.4.2.0', versionDate: '18 AUG 2026' },
        simulationParams,
        setSimulationParams,
        selectedClass,
        setSelectedClass,
        searchQuery,
        setSearchQuery,
        selectedWeaponIds,
        toggleWeaponComparison,
        selectWeaponsForComparison,
        clearComparisons,
        activeChartType,
        setActiveChartType,
        inspectingWeapon,
        setInspectingWeapon,
        isLoading,
        error,
        fetchLiveDataset,
        resetToBundledDataset,
      }}
    >
      {children}
    </WeaponContext.Provider>
  );
};

export const useWeapons = () => {
  const context = useContext(WeaponContext);
  if (!context) {
    throw new Error('useWeapons must be used within a WeaponProvider');
  }
  return context;
};
