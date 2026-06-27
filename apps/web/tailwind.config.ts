import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — Forest palette
        'deep-forest': '#0B1A13',
        'hiraban-pine': '#183B2B',
        'forest-moss': '#536B4A',

        // Luxury accent
        'aged-brass': '#C5A66A',
        'soft-gold': '#D7BF88',

        // Neutrals
        'warm-ivory': '#F4F0E7',
        'stone': '#D8D1C3',
        'warm-gray': '#8A887F',
        'charcoal': '#1B1E1B',

        // Supporting
        'natural-clay': '#A66B4C',
      },
      fontFamily: {
        // Persian display
        'persian-display': ['Markazi Text', 'Noto Serif Arabic', 'serif'],
        // Persian interface
        'persian': ['Vazirmatn', 'sans-serif'],
        // English display
        'display': ['Cormorant Garamond', 'Georgia', 'serif'],
        // English interface
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'title': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.2' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
        '74': '18.5rem',
        '78': '19.5rem',
        '82': '20.5rem',
        '86': '21.5rem',
        '90': '22.5rem',
        '94': '23.5rem',
        '98': '24.5rem',
        '100': '25rem',
        '120': '30rem',
        '140': '35rem',
        '160': '40rem',
      },
      maxWidth: {
        'content': '1280px',
        'content-wide': '1440px',
        'prose-lg': '72ch',
        'prose-xl': '80ch',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-bottom': 'slideInBottom 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #0B1A13 0%, #183B2B 50%, #536B4A 100%)',
        'gradient-overlay': 'linear-gradient(to bottom, rgba(11,26,19,0) 0%, rgba(11,26,19,0.7) 100%)',
        'gradient-overlay-strong': 'linear-gradient(to bottom, rgba(11,26,19,0.2) 0%, rgba(11,26,19,0.85) 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C5A66A 0%, #D7BF88 100%)',
      },
      screens: {
        'xs': '360px',
        'sm': '430px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      zIndex: {
        'nav': '100',
        'modal': '200',
        'toast': '300',
        'tooltip': '400',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      aspectRatio: {
        'accommodation': '4/3',
        'hero': '16/9',
        'portrait': '3/4',
        'cinema': '21/9',
      },
    },
  },
  plugins: [],
}

export default config
