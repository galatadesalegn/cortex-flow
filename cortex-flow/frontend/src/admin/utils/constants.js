// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
  },
  CERTIFICATES: {
    BASE: '/certificates',
    BY_ID: (id) => `/certificates/${id}`,
  },
  SKILLS: {
    BASE: '/skills',
    BY_ID: (id) => `/skills/${id}`,
    BY_CATEGORY: (category) => `/skills/category/${category}`,
  },
  MESSAGES: {
    BASE: '/messages',
    BY_ID: (id) => `/messages/${id}`,
  },
  UPLOAD: {
    IMAGE: '/upload',
  },
};

// Skill categories
export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'Design',
  'Testing',
  'Other',
];

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  CERTIFICATES: '/certificates',
  SKILLS: '/skills',
  MESSAGES: '/messages',
  SERVICES: '/services',
  SETTINGS: '/settings',
  ABOUT: '/about',
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Max file sizes (in bytes)
export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

// Accepted file types
export const ACCEPTED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};
