export const validateRequired = (fields, body) => {
  const missing = [];
  for (const field of fields) {
    if (!body[field] || body[field].toString().trim() === '') {
      missing.push(field);
    }
  }
  return missing;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const validateUrl = (url) => {
  if (!url) return true; // optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateSkillLevel = (level) => {
  const num = parseInt(level);
  return !isNaN(num) && num >= 1 && num <= 100;
};

// Validate image URL - allow localhost in development, Cloudinary or production URLs
export const validateImageUrl = (url) => {
  if (!url) return true; // optional field
  if (typeof url !== 'string') return false;
  
  // Allow localhost URLs during development
  if (process.env.NODE_ENV !== 'production' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
    return true;
  }
  
  // Allow relative paths for local uploads (/uploads/filename)
  if (url.startsWith('/uploads/')) {
    return true;
  }
  
  // Allow Cloudinary URLs
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    return true;
  }
  
  // Allow production backend URL
  const backendUrl = process.env.BACKEND_URL || 'https://galatadesalegn-gi24.onrender.com';
  if (url.includes(backendUrl)) {
    return true;
  }
  
  // Also allow the domain without protocol for flexibility
  if (url.includes('galatadesalegn-gi24.onrender.com')) {
    return true;
  }
  
  // Allow other HTTPS URLs (for flexibility)
  if (url.startsWith('https://')) {
    return true;
  }
  
  // Allow HTTP URLs for Cloudinary in production
  if (url.startsWith('http://') && process.env.NODE_ENV === 'production') {
    // Allow HTTP URLs from Cloudinary
    if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
      return true;
    }
    return false;
  }
  
  // Allow HTTP URLs in development
  if (url.startsWith('http://') && process.env.NODE_ENV !== 'production') {
    return true;
  }
  
  // Reject other relative paths
  return false;
};
