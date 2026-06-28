import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#E63946',
          dark: '#C1121F',
          light: '#FF6B75',
        },
        // Backgrounds
        bg: {
          DEFAULT: '#0D0D0D',
          surface: '#1A1A1A',
          elevated: '#242424',
          overlay: '#2D2D2D',
        },
        // Text
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        // Border
        border: {
          DEFAULT: '#2D2D2D',
          subtle: '#1F1F1F',
        },
        // States
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        live: '#FF0000',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'nav': '64px', // Bottom nav height
      },

      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      screens: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-live': 'pulse-live 1.5s ease-in-out infinite',
      },

      aspectRatio: {
        'video': '16 / 9',
        'short': '9 / 16',
        'thumb': '16 / 9',
      },
    },
  },
  plugins: [],
}

export default config
