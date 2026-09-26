/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bf: {
          dark: '#0b0f17',
          panel: '#111827',
          card: '#161f30',
          border: '#223049',
          accent: '#00d2ff',
          teal: '#00f0ff',
          orange: '#ff6b00',
          amber: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
          muted: '#64748b',
          glow: 'rgba(0, 210, 255, 0.15)'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
