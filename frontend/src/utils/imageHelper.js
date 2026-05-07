const API_URL = import.meta.env.VITE_API_URL || 'https://galatadesalegn.onrender.com';

/**
 * Replaces localhost URLs with production URL
 * @param {string} url - The image URL to fix
 * @returns {string} - The fixed URL
 */
export const fixImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Replace localhost:5000 with production URL
  if (url.includes('http://localhost:5000')) {
    return url.replace(/http:\/\/localhost:5000/g, API_URL);
  }
  
  // Replace localhost:8888 with production URL
  if (url.includes('http://localhost:8888')) {
    return url.replace(/http:\/\/localhost:8888/g, API_URL);
  }
  
  // Replace 127.0.0.1:5000 with production URL
  if (url.includes('http://127.0.0.1:5000')) {
    return url.replace(/http:\/\/127\.0\.0\.1:5000/g, API_URL);
  }
  
  return url;
};

/**
 * Gets a safe image URL with fallback
 * @param {string} url - The image URL
 * @param {string} fallback - Fallback URL or emoji
 * @returns {string} - The safe image URL
 */
export const getSafeImageUrl = (url, fallback = null) => {
  if (!url) return fallback;
  const fixedUrl = fixImageUrl(url);
  return fixedUrl;
};
