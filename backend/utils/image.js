/**
 * Helper to ensure image URLs are full URLs
 * @param {string} imagePath - The path to the image
 * @returns {string|null} - The full URL or null
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Convert relative path to full URL
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:8888';

  // Fix legacy URLs that might be stored in the database with the wrong port
  if (typeof imagePath === 'string' && imagePath.includes('localhost:5000')) {
    return imagePath.replace('localhost:5000', 'localhost:8888');
  }
  if (typeof imagePath === 'string' && imagePath.includes('localhost:5001')) {
    return imagePath.replace('localhost:5001', 'localhost:8888');
  }
  
  // If it's already a full URL or data URI, return as-is
  if (
    imagePath.startsWith('http://') || 
    imagePath.startsWith('https://') || 
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }
  
  // Handle case where path might already have /uploads prefix or not
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
};
