# 🚀 ATELIER Studio Edition — Production Deployment Guide

This guide provides step-by-step instructions for deploying ATELIER to production for free using **Render** (or **Vercel** for frontend + Render for backend).

---

## 🌟 Method 1: Render 1-Click Blueprint (Recommended)

Render can automatically spin up both your backend Web Service and frontend Static Site using the included `render.yaml` file.

### Step-by-Step Instructions:
1. **Push your code to GitHub / GitLab**:
   ```bash
   git add .
   git commit -m "feat: configure production deployment with Stripe and Render blueprint"
   git push origin main
   ```
2. **Open Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com).
   - Click **New +** in the top navigation bar.
   - Select **Blueprint**.
3. **Connect Your Repository**:
   - Select your `ecommerce` repository.
   - Render will detect the `render.yaml` file and pre-configure:
     - `atelier-api` (Node Web Service)
     - `atelier-frontend` (Static Site with SPA rewrite rules)
4. **Click Apply**:
   - Render will provision the build, link the API URL directly to the frontend, and provide your live URLs:
     - Frontend: `https://atelier-frontend.onrender.com`
     - Backend API: `https://atelier-api.onrender.com`

---

## 🛠️ Method 2: Manual Setup on Render

If you prefer creating the services manually in the Render dashboard:

### Part A: Deploy the Backend (Web Service)
1. Go to **New +** → **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `atelier-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. **Environment Variables**:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `5001` | Server listening port |
   | `JWT_SECRET` | *(Generate a 32+ character random string)* | Secure token signing |
   | `FRONTEND_URL` | `https://your-frontend.onrender.com` | Or your custom domain / `*` |
   | `STRIPE_SECRET_KEY` | `sk_test_...` *(or leave blank for Sandbox mode)* | Real or test Stripe key |
   | `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` *(or leave blank for Sandbox mode)* | Client Stripe key |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Optional Stripe webhook secret |
   | `MONGO_URI` | *(Optional MongoDB connection string)* | Leave empty to use in-memory seed data |
5. Click **Create Web Service**. Note your backend URL (e.g. `https://atelier-api.onrender.com`).

---

### Part B: Deploy the Frontend (Static Site)
1. Go to **New +** → **Static Site**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `atelier-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   | Key | Value | Notes |
   |---|---|---|
   | `VITE_API_URL` | `https://atelier-api.onrender.com/api` | Your backend URL from Part A |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Optional Stripe key |
5. **Redirects / Rewrites** *(Crucial for React Router)*:
   - Scroll to **Redirects / Rewrites**.
   - Add rule:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## ⚡ Method 3: Frontend on Vercel + Backend on Render

If you prefer Vercel for your React frontend:

### Deploying Frontend to Vercel:
1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. In **Root Directory**, click **Edit** and choose `frontend`.
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://atelier-api.onrender.com/api`
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
5. Click **Deploy**.
6. The included `frontend/vercel.json` automatically handles SPA route fallbacks so direct visits to `/shop`, `/product/fash-001`, and `/checkout` will work seamlessly without 404 on refresh.

---

## 🔍 Verification & Smoke Test Checklist

Once deployed, verify your live store with this quick checklist:

- [ ] **Health Check**: Visit `https://your-api.onrender.com/api/health` — should return `{"status":"ok"}`.
- [ ] **Catalog & Images**: Open `https://your-frontend.onrender.com` — confirm products, hero imagery, and categories display cleanly.
- [ ] **Client Routing**: Refresh the page on `https://your-frontend.onrender.com/shop` — confirm it does not show a 404.
- [ ] **Stripe Checkout**: Add a garment to the shopping bag, proceed to `/checkout`, click `Success Card (4242...)`, and place order — confirm digital receipt appears.
- [ ] **Admin & Profile**: Sign in with `client@example.com` / `client123` or `admin@example.com` / `admin123`.

---

## 💡 Pro-Tips for Render Free Tier

- **Free Tier Sleep Behavior**: Render's free web services automatically spin down after 15 minutes of inactivity. The first request after sleep may take ~30–50 seconds to boot up. To keep your service active, you can ping your `/api/health` endpoint with a free uptime monitor like [UptimeRobot](https://uptimerobot.com) or [Cron-Job.org](https://cron-job.org).
