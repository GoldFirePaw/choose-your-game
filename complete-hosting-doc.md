# Choose Your Game — Complete Hosting & Environment Documentation

## 🌍 Overview

This project uses multiple tools and hosting providers:

### **Backend**
- **Local environment** → Runs on your Mac (Node.js + Express)
- **Local MongoDB** → Installed via Homebrew
- **Local Staging** → Also on your Mac, separate database
- **Production backend** → Hosted on **Render**

### **Frontend**
- **Local environment** → Vite dev server
- **Production frontend** → Hosted on **Netlify**

### **Database**
- **Local DBs** → `choose-your-game-local`, `choose-your-game-staging`
- **Production DB** → **MongoDB Atlas** (cloud cluster)

---

## 🏗️ Project Structure

```
choose-your-game/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   └── controllers/
│
└── frontend/
    ├── src/
    ├── public/
    └── vite.config.js
```

---

## ⚙️ Environments

### Backend Environments

| Environment   | Command          | Loads             | Database                | Hosting       |
|---------------|------------------|-------------------|-------------------------|---------------|
| **Local**     | `npm run dev`    | `.env.local`      | choose-your-game-local  | your Mac      |
| **Staging**   | `npm run staging`| `.env.staging`    | choose-your-game-staging| your Mac      |
| **Production**| `npm start`      | `.env.production` | MongoDB Atlas           | Render        |

---

## 🔧 Environment Variables

### `.env.local`
```
MONGO_URI=mongodb://localhost:27017/choose-your-game-local
PORT=3001
NODE_ENV=local
```

### `.env.staging`
```
MONGO_URI=mongodb://localhost:27017/choose-your-game-staging
PORT=3002
NODE_ENV=staging
```

### `.env.production`
```
MONGO_URI=mongodb+srv://YOUR_ATLAS_CLUSTER
PORT=3001
NODE_ENV=production
```

---

## ⚙️ Tools Used

### 🟢 Local Development Tools

#### **Node.js**
Backend runtime.

#### **Nodemon**
Auto-reloads backend on changes.

#### **MongoDB Community Edition (local)**
Local database server.  
Starts with:

```
brew services start mongodb-community
```

Stops with:

```
brew services stop mongodb-community
```

Data stored permanently at:

- Intel Mac → `/usr/local/var/mongodb/`
- ARM Mac → `/opt/homebrew/var/mongodb/`

---

### 🟠 Cloud Tools

#### **Render (Backend Hosting)**
- Deploys backend (Node.js)
- Loads `.env.production`
- Connects to Atlas

#### **Netlify (Frontend Hosting)**
- Builds and deploys React app
- Uses Vite output

#### **MongoDB Atlas**
- Cloud database for production
- You configured:
  - cluster
  - production DB user
  - network access

---

## 🚀 Running the Project

### 1️⃣ Start MongoDB locally
If it's not running:

```
brew services start mongodb-community
```

---

### 2️⃣ Backend Commands

#### ▶️ Local Development
```
cd backend
npm run dev
```

#### ▶️ Local Staging
```
cd backend
npm run staging
```

#### ▶️ Production (Render)
Render executes:

```
npm install
npm start
```

Which triggers:

```
env-cmd -f .env.production node server.js
```

---

### 3️⃣ Frontend Commands

#### ▶️ Local Development
```
cd frontend
npm install
npm run dev
```

Opens at:

```
http://localhost:5173
```

#### ▶️ Production (Netlify)
Netlify executes:

```
npm install
npm run build
```

And serves from `dist/`

---

## 🚀 Deploying the Backend (Render)

### 1. Create new Web Service
- Environment: **Node**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### 2. Add environment variables in Render
- `MONGO_URI=your_atlas_uri`
- `PORT=3001`
- `NODE_ENV=production`

### 3. Allow Render IPs in MongoDB Atlas

---

## 🚀 Deploying the Frontend (Netlify)

1. Create new site from Git
2. Root directory: `frontend`
3. Build command:
```
npm run build
```
4. Publish directory:
```
dist
```

---

## 🛠️ Troubleshooting

### ❌ MongoDB connection errors
- Ensure MongoDB is running locally
- Check `MONGO_URI`
- Check Atlas network access

### ❌ Backend unreachable from frontend
- Check API URL in React env:
```
VITE_API_URL=https://your-render-url
```

### ❌ Port already in use
```
lsof -i :3001
kill -9 PID
```

---

## 🧠 Summary

| Component | Local               | Staging            | Production         |
|-----------|---------------------|--------------------|--------------------|
| Backend   | Nodemon + local DB  | Nodemon + local DB | Render             |
| Frontend  | Vite                | Vite               | Netlify            |
| Database  | Mongo local         | Mongo local        | MongoDB Atlas      |

---

## 🎉 You're now fully equipped to run and deploy the entire project!

