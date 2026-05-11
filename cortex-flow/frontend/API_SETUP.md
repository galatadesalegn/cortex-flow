# Frontend API Integration Setup

## Overview
Your frontend portfolio is now connected to your backend API. When you add/edit projects, skills, or certificates in the admin panel, they will automatically appear on your portfolio website.

## Setup Steps

### 1. Create Environment File
Create a file named `.env` in the Frontend folder (same level as package.json):

```
VITE_API_URL=http://localhost:5000
```

### 2. Install Dependencies
```bash
cd Frontend
npm install
```

### 3. Start All Services
You need to run 3 things simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Admin Panel:**
```bash
cd admin
npm run dev
```

**Terminal 3 - Frontend Portfolio:**
```bash
cd Frontend
npm run dev
```

### 4. Access URLs
- **Portfolio:** http://localhost:5174 (or 5173 if admin isn't running)
- **Admin Panel:** http://localhost:5173
- **Backend API:** http://localhost:5000

## How It Works

### Data Flow:
1. You add a project in **Admin Panel** → POST to `/api/projects`
2. Backend saves to **Neon PostgreSQL** database
3. **Frontend Portfolio** fetches from `/api/projects` on page load
4. Project appears automatically on your portfolio!

### API Integration Files:
```
src/
├── services/
│   ├── api.js           # Axios instance
│   ├── publicService.js # API calls for public data
│   └── index.js         # Barrel exports
├── hooks/
│   ├── usePublicData.js # React hooks for data fetching
│   └── index.js
└── Components/Home/
    ├── Projects.jsx     # Now uses API data ✓
    ├── Skills.jsx       # Now uses API data ✓
    └── Certificates.jsx # Now uses API data ✓
```

## Features

### Projects
- Fetches from `/api/projects`
- Displays loading spinner while fetching
- Shows "No projects found" if empty
- Updates automatically when you add/edit in admin

### Skills
- Fetches from `/api/skills`
- Groups by category (Frontend, Backend, etc.)
- Falls back to static data if API fails
- Updates automatically

### Certificates
- Fetches from `/api/certificates`
- Shows loading state
- Updates automatically

## Troubleshooting

### "Failed to load projects"
- Check backend is running: `curl http://localhost:5000/health`
- Check CORS is enabled in backend (should be)
- Check frontend `.env` has correct API URL

### Data not updating after admin edit
- Refresh the portfolio page (F5)
- Check browser console for errors (F12)

### CORS errors
Backend CORS is configured to allow all origins in development.

## Next Steps

1. Add your real projects in the admin panel
2. Add your skills with categories
3. Add your certificates
4. Watch them appear on your portfolio!

## Production Deployment

When deploying to production:
1. Change `VITE_API_URL` to your deployed backend URL
2. Backend CORS should be restricted to your frontend domain
3. Both frontend and backend should be HTTPS
