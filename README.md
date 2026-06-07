<div align="center">

<img src="https://img.shields.io/badge/CORTEX%20FLOW-Developer%20Portfolio-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="Cortex Flow" />

# 🧠 CORTEX FLOW

### A modern, full-stack developer portfolio with a built-in admin command center

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-galatadesalegn.me-6366f1?style=flat-square)](https://www.galatadesalegn.me/)
[![Repo](https://img.shields.io/badge/GitHub-cortex--flow-181717?style=flat-square&logo=github)](https://github.com/galatadesalegn/cortex-flow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

<br />

[![Cortex Flow Preview](https://res.cloudinary.com/debw95rak/image/upload/w_900,q_auto,f_auto/portfolio/image-1779567008778-556720869_htrdku)](https://www.galatadesalegn.me/)

> 🖱️ *Click to visit the live portfolio*

</div>

---

## 📖 Overview

**Cortex Flow** is a full-stack developer portfolio platform built for performance and control. The public-facing site showcases work, skills, and experience with smooth animations and a dark-mode-first design. Behind the scenes, a private admin dashboard lets you manage every piece of content — from projects and testimonials to your CV and profile image — without touching code.

---

## ✨ Features

### 🌐 Public Portfolio

| Section | Description |
|---|---|
| **Hero** | Animated introduction with call-to-action buttons |
| **About** | Personal biography and professional summary |
| **Skills** | Visual representation of technical expertise |
| **Projects** | Filterable showcase of work and case studies |
| **Experience** | Timeline of professional history and education |
| **Testimonials** | Client and colleague feedback |
| **Contact** | Functional inquiry form with backend integration |

### ⚙️ Admin Dashboard

| Feature | Description |
|---|---|
| **Overview** | Summary cards and real-time activity charts |
| **Content Management** | Editors for projects, skills, experience, and testimonials |
| **Profile Management** | Update bio, profile images, and CV uploads |
| **System Monitoring** | Live terminal output and server statistics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express |
| **Database** | MongoDB (Mongoose) |
| **State Management** | React Context API, Custom Hooks |
| **Storage** | Local uploads + Cloudinary (optional) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn
- MongoDB Atlas account

### Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/galatadesalegn/cortex-flow.git
cd cortex-flow
```

**2. Install dependencies**
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

**3. Configure environment variables**

Create a `.env` file in `/backend`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in `/frontend`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

**4. Start the development servers**
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

---

## ☁️ Deployment

### Backend → Render

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://www.galatadesalegn.me
```

### Frontend → Vercel

```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

---

## 📁 Project Structure

```
cortex-flow/
├── frontend/                     # React App (Vite + Tailwind)
│   └── src/
│       ├── admin/                # Full admin application
│       │   ├── components/       # Admin UI (charts, editors, modals)
│       │   ├── hooks/            # Admin-specific custom hooks
│       │   └── pages/            # Dashboard, Projects, Skills, etc.
│       ├── components/           # Public site UI components
│       │   ├── home/             # Section components (Hero, Projects, etc.)
│       │   └── layout/           # Navbar, Footer
│       ├── pages/                # Public routes (Home, ProjectSingle)
│       └── services/             # Axios API integration layer
│
├── backend/                      # Node.js Express API
│   ├── controllers/              # Request handlers (auth, projects, messages)
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API endpoint definitions
│   ├── middleware/               # Auth & error handling
│   ├── uploads/                  # Local asset storage
│   └── server.js                 # Entry point
│
└── README.md
```

---

## 🔒 Security

- **JWT Authentication** — All admin routes are protected with token-based auth
- **Middleware Guards** — Role-based access control on sensitive endpoints
- **Input Validation** — Server-side validation on all form submissions
- **Error Handling** — Centralized error middleware; no stack traces in production

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Galata Desalegn](https://www.galatadesalegn.me/)

</div>
