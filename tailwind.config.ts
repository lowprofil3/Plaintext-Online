import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          background: '#0a0f0d',
          surface: '#0f1714',
          primary: '#5af78e',
          accent: '#5ad1f7',
          warning: '#f7d65a',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(90, 247, 142, 0.12)',
      }
    }
  },
  plugins: [],
};

export default config;
