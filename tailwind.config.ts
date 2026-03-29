import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0F1C',
        panel: '#111827',
        neon: '#00D4FF',
        electric: '#7C3AED',
        cyan: '#22D3EE',
        profit: '#00FF88',
        loss: '#FF4D4D',
        neutral: '#FACC15'
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 212, 255, 0.20)',
        purple: '0 0 20px rgba(124, 58, 237, 0.18)'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at top left, rgba(0,212,255,0.12), transparent 24%), radial-gradient(circle at bottom right, rgba(124,58,237,0.16), transparent 22%)'
      }
    }
  },
  plugins: []
};

export default config;
