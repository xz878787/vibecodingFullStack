/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f5',
          100: '#ebeae5',
          200: '#d6d4cb',
          300: '#bdb8ab',
          400: '#a59e8c',
          500: '#8d8474',
          600: '#756c60',
          700: '#5e564e',
          800: '#4a443e',
          900: '#3d3835',
          950: '#1f1d1b',
        },
        paper: {
          50: '#fdfcf8',
          100: '#f9f5eb',
          200: '#f2ebd8',
          300: '#e8dbb6',
          400: '#d9c58e',
          500: '#cab06a',
        },
        vermilion: {
          400: '#dc2626',
          500: '#b91c1c',
          600: '#991b1b',
        }
      },
      fontFamily: {
        song: ['Noto Serif SC', 'STSong', 'SimSun', 'serif'],
        kai: ['Ma Shan Zheng', 'STKaiti', 'KaiTi', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'brush-stroke': 'brushStroke 1.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        brushStroke: {
          '0%': { opacity: '0', strokeDashoffset: '100' },
          '100%': { opacity: '1', strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
