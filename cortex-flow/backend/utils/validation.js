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

// Validate image URL - reject localhost, allow Cloudinary or production URLs
export const validateImageUrl = (url) => {
  if (!url) return true; // optional field
  if (typeof url !== 'string') return false;
  
  // Reject localhost URLs
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return false;
  }
  
  // Allow Cloudinary URLs
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    return true;
  }
  
  // Allow production backend URL
  const backendUrl = process.env.BACKEND_URL || 'https://galatadesalegn.onrender.com';
  if (url.includes(backendUrl)) {
    return true;
  }
  
  // Allow other HTTPS URLs (for flexibility)
  if (url.startsWith('https://')) {
    return true;
  }
  
  // Reject HTTP URLs (non-HTTPS)
  if (url.startsWith('http://')) {
    return false;
  }
  
  // Reject relative paths (should be full URLs)
  return false;
};
