/**
 * Helper to ensure image URLs are full URLs
 * @param {string} imagePath - The path to the image
 * @returns {string|null} - The full URL or null
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's a single emoji or a very short string without extensions/slashes, return as-is
  if (typeof imagePath === 'string' && imagePath.length <= 8 && !imagePath.includes('.') && !imagePath.includes('/')) {
    return imagePath;
  }
  
  // Convert relative path to full URL using production base
  const baseUrl = process.env.BACKEND_URL || 'https://galata-desalegn.onrender.com';

  // If it's already a full URL or data URI, return as-is (Cloudinary URLs etc)
  if (
    imagePath.startsWith('http://') || 
    imagePath.startsWith('https://') || 
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }
  
  // Handle relative paths - Ensure they come from the production uploads folder
  let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  if (!cleanPath.startsWith('/uploads/')) {
    cleanPath = `/uploads${cleanPath}`;
  }
  
  return `${baseUrl}${cleanPath}`;
};
