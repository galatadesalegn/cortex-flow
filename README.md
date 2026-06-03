<div align="center">

# ⚡ Cortex Flow

### A modern, high-performance developer portfolio

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/badge/deployed-live-brightgreen?style=flat-square)](https://your-live-url.com)

<br />

![Cortex Flow Preview](https://placehold.co/900x500/0f172a/38bdf8?text=Cortex+Flow+Preview&font=montserrat)

<br />

[🌐 Live Demo](https://your-live-url.com) · [📋 Report Bug](https://github.com/galatadesalegn/cortex-flow/issues) · [✨ Request Feature](https://github.com/galatadesalegn/cortex-flow/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Sections](#-sections)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🧠 About

**Cortex Flow** is a sleek, modern developer portfolio built to showcase projects, skills, and experience with style. Designed with performance and aesthetics in mind — smooth animations, responsive layouts, and a clean dark-mode-first design that leaves a lasting impression on recruiters and collaborators.

---

## ✨ Features

- ⚡ **Blazing fast** — Vite-powered dev & build pipeline
- 🎨 **Dark/Light mode** — system-aware theme switching
- 📱 **Fully responsive** — mobile, tablet, and desktop
- 🖱️ **Smooth animations** — scroll-triggered reveals and micro-interactions
- 📬 **Contact form** — powered by a Node.js backend
- 🗂️ **Project showcase** — filterable by tech stack or category
- ♿ **Accessible** — semantic HTML and keyboard-navigable
- 🔍 **SEO optimized** — meta tags and Open Graph support

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite |
| **Styling** | Tailwind CSS 3, custom CSS animations |
| **Backend** | Node.js, Express |
| **Email** | Nodemailer |
| **Routing** | React Router v6 |
| **Icons** | Lucide React |
| **Deployment** | Vercel / Netlify (frontend) + Render (backend) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18+**
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/galatadesalegn/cortex-flow.git
cd cortex-flow
```

**2. Install frontend dependencies**

```bash
cd client
npm install
```

**3. Install backend dependencies**

```bash
cd ../server
npm install
```

**4. Set up environment variables**

```bash
# In /server, create a .env file:
cp .env.example .env
```

Then fill in your values:

```env
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RECEIVER_EMAIL=your_email@gmail.com
```

**5. Start the development servers**

In two separate terminals:

```bash
# Terminal 1 — Frontend
cd client
npm run dev

# Terminal 2 — Backend
cd server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
cortex-flow/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ...
│   │   ├── pages/           # Page-level components
│   │   ├── data/            # Portfolio content (projects, skills, etc.)
│   │   │   └── projects.js
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                  # Node.js + Express backend
│   ├── routes/
│   │   └── contact.js       # Contact form endpoint
│   ├── .env.example
│   └── index.js
│
└── README.md
```

---

## 🗂 Sections

| Section | Description |
|---------|-------------|
| **Hero** | Animated intro with name, title, and CTA buttons |
| **About** | Brief bio, photo, and personality highlights |
| **Skills** | Visual skill grid organized by category |
| **Projects** | Filterable cards with live demo & GitHub links |
| **Experience** | Timeline of work history and education |
| **Contact** | Working contact form backed by Node.js |

---

## 🎨 Customization

All portfolio content lives in `client/src/data/`. No need to touch component code — just edit these files:

```js
// client/src/data/projects.js
export const projects = [
  {
    title: "My Awesome Project",
    description: "What it does and why it's cool.",
    tags: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://...",
    githubUrl: "https://...",
    image: "/images/project1.png",
  },
  // ...
];
```

To change colors, edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      accent: "#38bdf8",   // your brand color
      dark: "#0f172a",
    }
  }
}
```

---

## 🌍 Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
# Deploy the /dist folder to Vercel
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deploys on every push.

### Backend (Render)

1. Push your repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `server/`
4. Add your environment variables in the Render dashboard
5. Deploy 🚀

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by **Galata Desalegn**

⭐ Star this repo if you found it helpful!

</div>
