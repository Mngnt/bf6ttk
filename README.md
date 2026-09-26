# BF6 TTK Ballistics Lab & Weapon Analytics

A high-performance, interactive Battlefield 6 weapon analytics and Time-to-Kill (TTK) comparison web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Chart.js**, powered by data from [Sym.gg](https://sym.gg/legacy/pages/bf6/data/bf6.json).

![BF6 TTK Preview](https://img.shields.io/badge/BF6_Data-v1.4.2.0-00d2ff?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React_18-TypeScript-blue?style=for-the-badge)
![Styling](https://img.shields.io/badge/TailwindCSS-Chart.js-emerald?style=for-the-badge)

---

## ⚡ Quick Start

### 1. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 2. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

### 3. Preview Production Build
```bash
npm run preview
```

---

## 🎯 Key Features

### 1. Interactive Ballistics Graphs (0m to 200m)
- **Time to Kill (TTK)**: Exact stepped curves taking into account fire rate, bullets to kill, and optional bullet flight time delay (\(d / v\)).
- **Damage Falloff**: Full piecewise linear interpolation curves representing Battlefield 6 damage steps, ramps, and sweet spots.
- **Bullets to Kill (BTK)**: Stepped integers depicting shots required to eliminate a target at each meter mark.
- **Kills Per Magazine**: Computes how many full kills are possible per reload at close, medium, and extreme ranges.
- **DPS Output**: Continuous damage-per-second capability across range brackets.
- **Radar Comparison Profile**: Multi-axis radar polygon comparing Fire Rate, Close TTK, Mid TTK, Mag Capacity, Bullet Velocity, and Reload Agility.

### 2. Multi-Weapon Comparison Tray & Head-to-Head Matrix
- Select up to 8 weapons simultaneously from any class.
- Color-coded comparison lines on graphs with synchronized tooltips.
- **Head-to-Head Matrix**: Direct side-by-side comparison table where the best stat in each category is automatically highlighted in glowing green.
- **Quick Presets**: One-click bundles for *Meta Rifles*, *CQC SMGs*, *LMG Firepower*, and *Precision Snipers*.

### 3. Combat Simulation Engine
- **Target Health Slider**: Adjust between standard 100 HP, 120 HP (body armor), 60 HP (hardcore mode), or custom values.
- **Hit Location Multiplier**: Toggle between Body (1.0x), Upper Chest (1.1x), Headshot (1.5x), Lethal Head (2.0x), or fine-tune with a slider.
- **Shotgun Pellet Hit Rate**: Configure pellet hit ratios (100% 16/16 pellets, 75%, 50%, or 1 pellet).
- **Bullet Flight Time**: Simulate realistic projectile flight delay based on muzzle velocity.
- **Graph Distance Zoom**: Toggle graph scale between 50m, 100m, 150m, and 200m.

### 4. Comprehensive Weapon Database Table
- Filter by all 8 weapon classes: Assault Rifles, Carbines, SMGs, LMGs, DMRs, Bolt-Action Snipers, Shotguns, Secondaries.
- Instant search by weapon display name, internal codename, ammo caliber, or class.
- Sort ascending or descending on any specification: Close TTK, Mid TTK, Long TTK, Fire Rate (RPM), Mag Size, Kills/Mag, Max Damage Range, Velocity, and Reload Time.
- **CSV Data Export**: Export the calculated dataset with a single click.

### 5. In-Depth Weapon Inspector Modal
- Click **Inspect** on any weapon to view all 30+ internal ballistics and gunplay variables:
  - Tactical Reload & Empty Reload times, reload threshold percentage
  - ADS & Hipfire base spread, movement spread increase
  - Recoil amount, direction angles, and recovery decay factors
  - Muzzle velocity, drag coefficient, and bullet gravity

---

## 📂 Project Architecture

```
BF6TTK/
├── src/
│   ├── types/
│   │   └── weapon.ts            # Type definitions for raw & computed weapon stats
│   ├── utils/
│   │   ├── ballistics.ts         # Math engine for piecewise damage, TTK, BTK, KPM, DPS
│   │   ├── constants.ts          # Weapon classes, color palettes, and labels
│   │   └── weaponStats.ts        # Parsing, caching, and CSV export utilities
│   ├── context/
│   │   └── WeaponContext.tsx     # Centralized React state management
│   ├── components/
│   │   ├── Header.tsx            # Header, live URL fetcher modal, CSV export
│   │   ├── SimulationControls.tsx# Health, hit multiplier, velocity delay controls
│   │   ├── ComparisonDrawer.tsx  # Pinned comparison tray and preset bundles
│   │   ├── ChartsView.tsx        # Interactive Chart.js line and radar views
│   │   ├── HeadToHeadMatrix.tsx  # Head-to-head comparison grid with winning highlights
│   │   ├── ClassFilterTabs.tsx   # Weapon class tabs and search filter
│   │   ├── WeaponsTable.tsx      # Sortable master table with inspection buttons
│   │   └── WeaponDetailModal.tsx # Deep inspection modal for single weapon attributes
│   ├── data/
│   │   └── bf6.json              # Bundled Sym.gg weapon data
│   ├── App.tsx                   # Main dashboard application
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Tailwind CSS & tactical typography styles
├── index.html                    # Application HTML template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind theme colors and styles
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite build and manual chunking config
```
