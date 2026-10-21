# ATELIER — Full-Stack Luxury E-Commerce Platform

A production-grade, architectural bespoke e-commerce platform. Built with a modern decoupled stack: **React (Vite) + Tailwind CSS** on the frontend, and **Node.js + Express + Stripe** on the backend.

---

## 🏗️ Architecture & Project Structure

```text
ecommerce/
├── .gitignore                   # Root ignore (protects .env and build files)
├── .npmrc                       # Dependency resolution rules
├── package.json                 # Project orchestrator
├── README.md                    # Project documentation
│
├── frontend/                    # Client application (React + Vite + Tailwind)
│   ├── public/                  # Static assets & favicons
│   ├── src/
│   │   ├── assets/              # Curated imagery & branding
│   │   ├── components/          # Reusable UI components (Navbar, Footer, Modal, Card)
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── pages/               # HomePage, ShopPage, ProductPage, CartPage, CheckoutPage, AdminPage
│   │   ├── services/            # Axios API client & endpoints
│   │   ├── App.jsx              # Routing & Layout configuration
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Tailwind directives & luxury typography styles
│   ├── index.html               # Semantic HTML5 entry with Google Fonts
│   ├── tailwind.config.js       # Luxury palette (sand, oat, timber, charcoal)
│   └── vite.config.js           # Vite build tooling
│
└── backend/                     # REST API Server (Node.js + Express)
    ├── config/                  # MongoDB Mongoose connection
    ├── controllers/             # Business logic (auth, products, orders, cart)
    ├── data/                    # Realistic seed data
    ├── middleware/              # Auth (JWT verification), Admin guard, Error handler
    ├── models/                  # Mongoose Schemas (User, Product, Order)
    ├── routes/                  # Express API route declarations
    ├── utils/                   # Token generator & helper utilities
    ├── server.js                # Express app entry & middleware pipeline
    └── .env.example             # Environment variable blueprint
```

---

## ⚡ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Lucide React, Axios
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, Morgan, Helmet, CORS, Express Rate Limit
- **Database**: MongoDB with Mongoose ODM (MongoDB Atlas cloud)
- **Tooling**: Git, Postman

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- Free MongoDB Atlas URI

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
# Server will run on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# Client will run on http://localhost:5173
```
