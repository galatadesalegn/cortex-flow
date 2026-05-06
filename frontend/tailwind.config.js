/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'script': ['Great Vibes', 'cursive'],
      },
      colors: {
        // Your brand accent color - stays consistent
        accent: '#1de9b6',
        'accent-hover': '#14b98a',
        
        // Dark mode colors - your existing palette
        'dark-primary': '#101413',
        'dark-secondary': '#0a1a14',
        'dark-accent': '#1c201f',
        'dark-card': '#13241c',
        'dark-border': '#3c4a42',
        'dark-text-primary': '#ffffff',
        'dark-text-secondary': '#e2e8f0',
        'dark-text-muted': '#a0aec0',
      }
    },
  },
  plugins: [],
}