```markdown

# Choose Your Game – Complete Setup & Usage Guide

## Table of Contents
1. Project Overview
2. Prerequisites
3. Installation & First Setup
4. Running the Project (Development)
# Choose Your Game — Fullstack Application
Choose Your Game is a fullstack application composed of:
- **Backend** — Node.js + Express API
- **Frontend** — React + Vite web interface
This documentation explains how to install, run, and manage the project across all environments (local, staging, production).
---
## Architecture
choose-your-game/
  backend/ # Express API
    server.js # Server entry point
    db.js # MongoDB connection
    routes/ # API routes
    controllers/ # Business logic
  frontend/ # React web application
    src/
    public/
    vite.config.js
---
## Environments Overview
The backend uses three distinct environments:
• Local — .env.local
• Staging — .env.staging
• Production — .env.production
Each environment is automatically loaded using env-cmd.
---
## Environment Variables
All `.env.*` files must contain:
MONGO_URI=
PORT=
NODE_ENV=
### Example — .env.local
MONGO_URI=mongodb://localhost:27017/choose-your-game-local
PORT=3001
NODE_ENV=local
### Example — .env.staging
MONGO_URI=mongodb://localhost:27017/choose-your-game-staging
PORT=3002
NODE_ENV=staging
### Example — .env.production
MONGO_URI=mongodb+srv://YOUR_REAL_ATLAS_CLUSTER
PORT=3001
NODE_ENV=production
Never commit `.env.production`.
---
## Installation
git clone https://github.com/GoldFirePaw/choose-your-game.git
cd choose-your-game
---
## Backend Setup
cd backend
npm install
### Backend Commands
npm run dev — loads .env.local
npm run staging — loads .env.staging
npm start — loads .env.production
Backend URLs:
• Local: http://localhost:3001
• Staging: http://localhost:3002
---
## Frontend Setup
cd frontend
npm install
npm run dev
Open http://localhost:5173/
---
## Development Workflow
1. Start backend:
cd backend
npm run dev
2. Start frontend:
cd frontend
npm run dev
3. Edit backend or frontend — automatic reloads activate.
---
## Database Management
Local MongoDB runs at mongodb://localhost:27017
Local databases:
• choose-your-game-local
• choose-your-game-staging
Production uses MongoDB Atlas.
---
## MongoDB Architecture Overview
Production → Atlas
Local → Mongo local server
Staging → local database
---
## Project Scripts Summary
Backend:
npm run dev
npm run staging
npm start
Frontend:
npm run dev
npm run build
npm run preview
---
## Git First-Time Setup
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
---
## Deployment Guide
1. Install Node on server
2. Upload project
3. Add `.env.production`
4. Install backend dependencies
5. Build frontend
6. Start backend with npm start
---
## Troubleshooting
Port issue: use lsof -i :PORT
MongoDB issue: check server running + URI
Missing modules: run npm install
---
## Notes
• Never commit environment files.
• Local and staging are isolated from production.
• Uses env-cmd for environment separation.
---
You're ready to develop!
  - Add to `.env.example` and document usage

---

## Useful Tools & Where to Find Them
- **MongoDB Compass:** GUI for MongoDB
- **Postman:** Test API endpoints
- **VS Code:** Recommended editor
- **nodemon:** Auto-restart backend
- **env-cmd:** Manage multiple .env files

---

## Final Notes
- Always keep your `.gitignore` up to date.
- Never commit secrets or sensitive data.
- Use `.env.example` to help teammates set up their own `.env` files.
- Document any new tools or scripts in this README.

---

Enjoy building and playing!
```

```