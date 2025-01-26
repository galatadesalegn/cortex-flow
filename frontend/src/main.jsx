import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'

// Clear old individual project caches on startup (too large for localStorage)
try {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('cached_project_') || k.startsWith('cache_time_project_')) {
      localStorage.removeItem(k);
    }
  });
} catch (e) {
  // Ignore if localStorage is unavailable
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
