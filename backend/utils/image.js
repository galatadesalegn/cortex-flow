/**
 * Helper to ensure image URLs are full URLs
 * @param {string} imagePath - The path to the image
 * @returns {string|null} - The full URL or null
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's a single emoji or a very short string without extensions/slashes, return as-is
  // This prevents emojis in the Service model from being prepended with the backend URL
  if (typeof imagePath === 'string' && imagePath.length <= 8 && !imagePath.includes('.') && !imagePath.includes('/')) {
    return imagePath;
  }
  
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
    // If it's a localhost URL with wrong port, fix it
    if (imagePath.includes('localhost:5000')) {
      return imagePath.replace('localhost:5000', baseUrl.replace('http://', ''));
    }
    if (imagePath.includes('localhost:5001')) {
      return imagePath.replace('localhost:5001', baseUrl.replace('http://', ''));
    }
    return imagePath;
  }
  
  // Handle case where path might already have /uploads prefix or not
  let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Ensure /uploads prefix for local files
  if (!cleanPath.startsWith('/uploads/') && !cleanPath.startsWith('http')) {
    cleanPath = `/uploads${cleanPath}`;
  }
  
  return `${baseUrl}${cleanPath}`;
};
