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
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        
        // Dynamic theme colors using CSS variables
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-accent': 'var(--bg-accent)',
        'bg-card': 'var(--bg-card)',
        'border-theme': 'var(--border-color)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'glass-bg': 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)',
        'dark-primary': '#0a1a14',
        'dark-secondary': '#0d1411',
      }
    },
  },
  plugins: [],
}