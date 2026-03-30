import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface:    '#0A0A0A',
        panel:      '#0C0C0E',
        chrome:     '#C0C0C0',
        silver: {
          50:  '#f0f0f0',
          100: '#e0e0e0',
          200: '#c8c8c8',
          300: '#b0b0b0',
          400: '#989898',
          500: '#808080',
          600: '#686868',
        },
        profit: '#4ade80',
        loss:   '#fb7185',
      },
      boxShadow: {
        chrome: '0 0 30px rgba(192,192,192,0.16), inset 0 1px 0 rgba(255,255,255,0.40)',
        glow:   '0 0 40px rgba(192,192,192,0.14)',
        glass:  '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
        card:   '0 8px 32px rgba(0,0,0,0.40)',
        purple: '0 0 20px rgba(124,58,237,0.12)',
        'neon-silver': '0 0 50px rgba(192,192,192,0.22)',
      },
      backgroundImage: {
        'chrome-gradient': 'linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 45%, #888 100%)',
        'hero-gradient':   'linear-gradient(180deg, #030303 0%, #070707 60%, #0a0a0a 100%)',
        'glass-panel':     'linear-gradient(145deg, rgba(18,18,20,0.95) 0%, rgba(10,10,12,0.98) 100%)',
      },
      animation: {
        'float':        'floatUp 5s ease-in-out infinite',
        'pulse-slow':   'pulse 3.5s ease-in-out infinite',
        'button-pulse': 'buttonPulse 2.7s ease-in-out infinite',
        'live-pulse':   'livePulse 2s ease-in-out infinite',
        'count-up':     'countUp 600ms ease both',
      },
      keyframes: {
        floatUp: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        livePulse: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.6' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        '4xl': '72px',
      },
    },
  },
  plugins: [],
};

export default config;
