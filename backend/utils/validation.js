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
