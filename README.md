# SocialSphere 🌐

> **Enterprise-Level Category-Based Social Media and Content Discovery Platform**

SocialSphere is a modern alternative to traditional social media platforms. Unlike standard monolithic feeds, SocialSphere organizes social content into structured, discovery-first categories — **Entertainment**, **Jobs & Careers**, **News**, **Education**, **Technology**, and **Sports** — alongside a personalized **“For You”** algorithmic stream.

---

## 🌟 Key Features

* **Category-Based Content Discovery**: Explore dedicated channels for Entertainment, Jobs & Careers, News, Education, Tech, and Sports.
* **Specialized Content Formats**:
  * **Job Postings**: Salary bands, experience requirements, skills tags, direct apply links.
  * **News Articles**: Headlines, sources, summaries, verified attribution.
* **Role-Based Access Control (RBAC)**: Distinct permissions and badges for Normal Users, Creators, Organizations, Moderators, and Administrators.
* **Real-Time Social Features**: Instant messaging, live notifications, optimistic likes, nested comments, and bookmarking.
* **Enterprise UI/UX**: Dark-mode glassmorphism aesthetic built with React, Vite, and Tailwind CSS.

---

## 🏗️ Architecture & Tech Stack

### Frontend
* **React 18** + **Vite**
* **Tailwind CSS** + Custom Design Tokens & Category Highlights
* **React Router v6**
* **Axios** with JWT Interceptors
* **Socket.IO Client** for live feeds & messaging
* **Lucide React** modern icons

### Backend
* **Node.js** + **Express.js** REST API
* **MongoDB** + **Mongoose ODM**
* **Socket.IO** WebSocket Server
* **JWT & bcryptjs** Authentication & Password Hashing
* **Helmet**, **CORS**, and **Rate Limiting** Security Layer
* **Cloudinary** / Local File Storage Fallback

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/23kumar2006/SocialMedia.git
cd SocialMedia

# Install all dependencies across workspace
npm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/socialsphere
JWT_SECRET=socialsphere_super_secure_jwt_secret_key_2026
```

### 4. Running Locally
Start both backend API and frontend dev server with a single command:
```bash
npm run dev
```

* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`
* **Health Check**: `http://localhost:5000/api/health`

---

## 📂 Project Structure

```text
SocialSphere/
├── frontend/             # React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/   # Common, Post, Feed, Profile, Messaging
│   │   ├── context/      # Auth, Socket, and Notification contexts
│   │   ├── pages/        # Home, Explore, Categories, Messages, Admin
│   │   └── services/     # Axios API & Socket.IO clients
├── backend/              # Node.js + Express REST & Socket.IO Backend
│   ├── src/
│   │   ├── config/       # Database, Cloudinary, Environment config
│   │   ├── middleware/   # Auth, RBAC, Error handling, Uploads
│   │   └── modules/      # User, Post, Category, Comment, Admin
│   └── server.js         # HTTP + WebSocket Server Entrypoint
├── package.json          # Monorepo workspace orchestrator
└── README.md
```

---

## 📄 License
MIT License. Built with ❤️ for next-generation content discovery.
