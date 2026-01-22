import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (Sky Blue Family)
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        // Semantic colors
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        // Neutral colors
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F7',
          200: '#D2D2D7',
          300: '#86868B',
          800: '#1D1D1F',
          900: '#000000',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Pretendard',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        'large-title': ['34px', { lineHeight: '41px', letterSpacing: '0.37px', fontWeight: '700' }],
        'title-1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px', fontWeight: '700' }],
        'title-2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px', fontWeight: '600' }],
        'headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '22px', letterSpacing: '-0.41px', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.32px', fontWeight: '400' }],
        'footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      borderRadius: {
        'button': '10px',
        'card': '12px',
      },
      boxShadow: {
        'button': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'button-hover': '0 2px 8px rgba(0, 0, 0, 0.16)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}

export default config
