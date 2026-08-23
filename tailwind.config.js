/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'timer-blue': '#2196F3',
        'timer-gray': '#E0E0E0',
        // Atelier palette: warm paper + ink, accent reserved for the dial
        paper: '#F3EFE6',
        surface: '#FBF8F2',
        hairline: '#DED7C6',
        'hairline-strong': '#C6BFAE',
        ink: '#191814',
        'ink-70': '#57534A',
        'ink-45': '#8B8578',
        'dial-outline': '#B7AF9E',
        'tick-major': '#A49B8A',
        'tick-minor': '#C6BFAE',
        success: '#3F7D4E',
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 300ms ease-in-out',
        'slide-out-right': 'slide-out-right 300ms ease-in-out',
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-in',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
