import tailwindcss from 'tailwindcss'

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
        // High-Key Theme System - White/Black/Blue Color Combos
        white: {
          DEFAULT: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          150: '#F0F0F0',
          200: '#E8E8E8',
          300: '#D4D4D4',
        },
        black: '#000000',
        // Blue accent colors
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        // Hairline border color
        border: 'rgba(0, 0, 0, 0.04)',
        // Glow effect colors
        glow: {
          white: 'rgba(255, 255, 255, 0.8)',
          subtle: 'rgba(255, 255, 255, 0.5)',
          blue: 'rgba(59, 130, 246, 0.3)',
          blueHover: 'rgba(59, 130, 246, 0.5)',
        },
      },
      spacing: {
        // 8px spacing system only
        '0': '0px',
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '12': '96px',
        '16': '128px',
        '20': '160px',
        '24': '192px',
        '32': '256px',
        // Fluid spacing
        'fluid-p': 'clamp(1rem, 3vw, 5rem)',
      },
      borderRadius: {
        'sm': '12px',
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '16px',
        '2xl': '16px',
      },
      boxShadow: {
        // High-Key Shadow System
        'high-key': '0 10px 40px rgba(0, 0, 0, 0.03)',
        'high-key-hover': '0 12px 50px rgba(0, 0, 0, 0.04)',
        'high-key-lg': '0 20px 60px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.5)',
        'glow-hover': '0 0 30px rgba(255, 255, 255, 0.7)',
      },
      fontSize: {
        // Fluid typography using clamp - High-Key spec (min 16px body)
        'xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
