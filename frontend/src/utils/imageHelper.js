const API_URL = import.meta.env.VITE_API_URL || 'https://galatadesalegn-gi24.onrender.com';

/**
 * Replaces localhost URLs with production URL
 * @param {string} url - The image URL to fix
 * @returns {string} - The fixed URL
 */
export const fixImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Handle Cloudinary URLs - they should work as-is
  if (url.includes('cloudinary.com')) {
    // Ensure Cloudinary URLs use HTTPS
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
  
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
  
  // Handle relative URLs that start with /uploads/
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
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
