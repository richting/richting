/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Blue
        blue: {
          50: '#F0F7FF',
          100: '#E0F0FF',
          200: '#B8DDFF',
          300: '#8AC6FF',
          400: '#5CAFFF',
          500: '#4A90E2', // Brand Primary
          600: '#3B7DD6',
          700: '#2D6AC4',
          800: '#1F57B2',
          900: '#11449F',
        },
        // Accent - Coral
        coral: {
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFC7C7',
          300: '#FFA9A9',
          400: '#FF8B8B',
          500: '#FF6B6B', // Brand Accent
          600: '#FF4D4D',
          700: '#FF2F2F',
          800: '#E61111',
          900: '#C70000',
        },
        // Secondary Colors
        purple: {
          500: '#9B6DD6',
        },
        green: {
          500: '#4ECDC4',
        },
        yellow: {
          500: '#FFE66D',
        },
        // Neutrals
        gray: {
          50: '#F8F9FA', // Background
          100: '#E8EEF2', // Border
          200: '#D1D9E0',
          300: '#B8C2CC',
          400: '#9FAAB8',
          500: '#7A8A99', // Tertiary text
          600: '#5A6C7D', // Secondary text
          700: '#465663',
          800: '#2C3E50', // Primary text
          900: '#1A252F',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'], // Headings
        body: ['Inter', 'sans-serif'], // Body
        sans: ['Inter', 'sans-serif'], // Default sans
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'xl': '0 12px 32px rgba(0, 0, 0, 0.16)',
        'glow': '0 0 16px rgba(74, 144, 226, 0.5)',
      }
    },
  },
  plugins: [],
}
