# Admin Panel - API Integration Guide

## Overview
This admin panel is now fully integrated with the Node.js/Express/Prisma backend API. It uses React Router for navigation, Axios for API calls, and JWT for authentication.

## Architecture

### Folder Structure
```
src/
├── services/           # API service layer
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js # Authentication API calls
│   ├── projectService.js
│   ├── certificateService.js
│   ├── skillService.js
│   ├── messageService.js
│   ├── uploadService.js
│   └── index.js       # Barrel exports
├── context/
│   └── AuthContext.jsx # Global auth state
├── hooks/             # Custom React hooks
│   ├── useAuth.js     # Access auth context
│   ├── useApi.js      # Generic API hook
│   ├── useProjects.js # Project operations
│   ├── useCertificates.js
│   ├── useSkills.js
│   ├── useMessages.js
│   └── useUpload.js   # File upload
├── utils/             # Utilities
│   ├── helpers.js
│   ├── constants.js
│   └── index.js
├── Components/        # UI components
├── Pages/            # Page components
└── App.jsx           # Main app with routing
```

## Key Features

### 1. Authentication Flow
- JWT stored in `localStorage` (token) and `localStorage` (user)
- Automatic token injection in API requests
- Auto-redirect to login on 401 errors
- Token verification on app load
- Protected routes using `ProtectedRoute` component

### 2. API Service Layer
```javascript
// services/api.js
- Axios instance with baseURL
- Request interceptor adds JWT token
- Response interceptor handles errors (401, 403, 404, 500)
- Auto-redirect to login on 401
```

### 3. Using the Hooks

#### Fetch Projects
```javascript
import { useProjects } from '../hooks';

const ProjectsPage = () => {
  const { projects, loading, error, refetch } = useProjects();
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <ProjectList projects={projects} />;
};
```

#### Create Project
```javascript
import { useCreateProject } from '../hooks';

const CreateProjectForm = () => {
  const { create, loading, error } = useCreateProject();
  
  const handleSubmit = async (data) => {
    const result = await create(data);
    if (result.success) {
      toast.success('Project created!');
    }
  };
};
```

#### Upload Image
```javascript
import { useUpload } from '../hooks';

const ImageUpload = () => {
  const { uploadImage, uploading, progress } = useUpload();
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const result = await uploadImage(file);
    if (result.success) {
      console.log('Image URL:', result.url);
    }
  };
};
```

### 4. Auth Hook Usage
```javascript
import { useAuth } from '../hooks';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      <span>{user?.email}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

| Service | Method | Endpoint |
|---------|--------|----------|
| Auth | POST | `/api/auth/login` |
| Auth | GET | `/api/auth/me` |
| Projects | GET | `/api/projects` |
| Projects | POST | `/api/projects` |
| Projects | PUT | `/api/projects/:id` |
| Projects | DELETE | `/api/projects/:id` |
| Certificates | GET | `/api/certificates` |
| Certificates | POST | `/api/certificates` |
| Certificates | PUT | `/api/certificates/:id` |
| Certificates | DELETE | `/api/certificates/:id` |
| Skills | GET | `/api/skills` |
| Skills | POST | `/api/skills` |
| Skills | PUT | `/api/skills/:id` |
| Skills | DELETE | `/api/skills/:id` |
| Messages | GET | `/api/messages` |
| Messages | DELETE | `/api/messages/:id` |
| Upload | POST | `/api/upload` |

## Usage Examples

### Service Direct Usage
```javascript
import { projectService, uploadService } from '../services';

// Get all projects
const { data } = await projectService.getAll();

// Create project
await projectService.create({
  title: 'My Project',
  description: 'Description',
  image: 'https://cloudinary.com/image.jpg'
});

// Upload image
const result = await uploadService.uploadImage(file);
```

### Error Handling
```javascript
import { getErrorMessage } from '../utils';

try {
  await projectService.create(data);
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
}
```

## Protected Routes

Routes under `/*` are automatically protected. Unauthenticated users are redirected to `/login`.

## Running the App

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your backend URL

# Start dev server
npm run dev
```

## Production Build

```bash
npm run build
```

## Integration with Existing Components

The existing components in `Components/` can now use the hooks:

```javascript
// In Projects.jsx
import { useProjects, useDeleteProject } from '../hooks';
import { toast } from 'sonner';

const Projects = () => {
  const { projects, loading, refetch } = useProjects();
  const { remove } = useDeleteProject();
  
  const handleDelete = async (id) => {
    const result = await remove(id);
    if (result.success) {
      toast.success('Project deleted');
      refetch();
    }
  };
  
  // ... rest of component
};
```

## Backend Prisma Migration

Remember to run the migration in the backend:
```bash
cd backend
npx prisma migrate dev --name add_certificates_skills
```

This adds the Certificate and Skill models to the database.
