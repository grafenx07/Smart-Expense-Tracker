# Deployment Guide: Smart Expense Tracker

This document provides step-by-step instructions for deploying the **Smart Expense Tracker** full-stack application across different cloud platforms and hosting environments.

---

## 1. Deployment Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Frontend Static Host    │
                          │ (Vercel / Netlify / CDN)  │
                          └─────────────┬─────────────┘
                                        │
                               HTTP / REST (JSON)
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │   Backend Web Service     │
                          │  (Render / Railway / VPS) │
                          └─────────────┬─────────────┘
                                        │
                               Disk File I/O
                                        ▼
                          ┌───────────────────────────┐
                          │    storage/expenses.json  │
                          │   (Persistent Storage)    │
                          └───────────────────────────┘
```

The application consists of two packages:
1. **Backend API (`/backend`)**: Express + TypeScript REST API compiling to CommonJS (`dist/server.js`). Standard Node.js process requiring a persistent filesystem for `expenses.json`.
2. **Frontend SPA (`/frontend`)**: React 19 + Vite + TypeScript compiling to static HTML/JS/CSS assets (`dist/`).

---

## 2. Environment Variables

### Backend Configuration
| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `3001` | Port number for Express server |
| `CORS_ORIGINS` | Recommended | `http://localhost:5173` | Comma-separated list of allowed frontend origins (e.g. `https://my-app.vercel.app`) |
| `STORAGE_PATH` | Optional | `src/storage/expenses.json` | Path to JSON data store file |

### Frontend Configuration
| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Recommended | `""` (relies on Vite proxy) | Full URL of deployed backend API (e.g. `https://api-smart-expense.onrender.com`) |

---

## 3. Option 1: Cloud Deployment (Render + Vercel) - Recommended

### Step 1: Deploy Backend to Render (Free Tier Web Service)

1. Push your repository to **GitHub**.
2. Sign in to [Render](https://render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   * **Name**: `smart-expense-tracker-api`
   * **Region**: Choose closest to target users
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   * `PORT`: `3001` (or leave empty, Render assigns `$PORT` automatically)
   * `CORS_ORIGINS`: `https://smart-expense-tracker.vercel.app` (your frontend domain)
6. Click **Create Web Service**. Render will deploy your API at `https://<your-service-name>.onrender.com`.
7. Verify deployment by visiting `https://<your-service-name>.onrender.com/docs` to see Swagger UI.

> [!NOTE]
> Render free tier spins down after 15 minutes of inactivity. For continuous persistent file storage, attach a **Render Persistent Volume** mounted at `/backend/dist/storage`.

---

### Step 2: Deploy Frontend to Vercel

1. Sign in to [Vercel](https://vercel.com/) and click **Add New** → **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   * **Framework Preset**: Vite
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   * **Name**: `VITE_API_URL`
   * **Value**: `https://<your-backend-service-name>.onrender.com`
5. Click **Deploy**. Vercel will build and host your production frontend.

---

## 4. Option 2: Self-Hosted Linux VPS (Ubuntu + PM2 + Nginx)

For maximum performance, complete data privacy, and full control over persistent storage on your own VPS (DigitalOcean, Linode, AWS EC2):

### Step 1: Prepare Server & Environment
Connect via SSH to your server and install Node.js 20, Git, and Nginx:

```bash
sudo apt update && sudo apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Step 2: Clone & Build Application

```bash
git clone https://github.com/grafenx07/Smart-Expense-Tracker.git
cd Smart-Expense-Tracker

# Build Backend
cd backend
npm install
npm run build

# Start Backend process with PM2
CORS_ORIGINS="http://your-domain.com" PORT=3001 pm2 start dist/server.js --name "expense-api"
pm2 save
pm2 startup

# Build Frontend
cd ../frontend
npm install
VITE_API_URL="http://your-domain.com" npm run build
```

### Step 3: Configure Nginx Reverse Proxy

Create Nginx site configuration `/etc/nginx/sites-available/expense-tracker`:

```nginx
server {
    listen 80;
    server_name your-domain.com; # or server IP

    # Serve Frontend static files
    location / {
        root /var/www/Smart-Expense-Tracker/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Express Backend
    location /expenses {
        proxy_pass http://127.0.0.1:3001/expenses;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy Swagger API docs
    location /docs {
        proxy_pass http://127.0.0.1:3001/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. Option 3: Docker Deployment

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/storage ./src/storage
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - CORS_ORIGINS=http://localhost:80
    volumes:
      - expense_data:/app/src/storage

  frontend:
    build:
      context: ./frontend
      args:
        - VITE_API_URL=http://localhost:3001
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  expense_data:
```

Run container stack:
```bash
docker-compose up -d --build
```

---

## 6. Pre-Flight Deployment Checklist

Before going live, ensure:

- [x] Backend TypeScript builds cleanly (`cd backend && npm run build`).
- [x] Frontend TypeScript and Vite bundle builds cleanly (`cd frontend && npm run build`).
- [x] Backend test suite passes (`cd backend && npm test`).
- [x] CORS origins set to matching frontend domain in `CORS_ORIGINS`.
- [x] Frontend `VITE_API_URL` set to target backend endpoint URL.
- [x] Storage directory (`storage/expenses.json`) has write permissions on host platform.
