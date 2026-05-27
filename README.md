# 🌸 She Can Foundation Contact & Admin System

A complete full-stack responsive web application built for the **She Can Foundation** using the MERN stack. This platform features a modern, accessible landing page, a secure contact form, and a protected Admin Dashboard for managing inquiries.

## 🚀 Features

- **Modern & Responsive UI**: Built with React, Tailwind CSS v3, and Framer Motion concepts. Features smooth micro-interactions, glassmorphism, and a robust Light/Dark mode toggle.
- **RESTful API Backend**: Node.js & Express.js backend with full security middleware (Helmet, Rate Limiting, CORS).
- **Secure Authentication**: JWT-based stateless authentication with secure HTTP-only cookie patterns or local storage for the Admin panel.
- **Admin Dashboard**: Features real-time contact form analytics, pagination, sorting, search, and message management (Read/Delete).
- **Form Validation**: Client-side validation using React Hook Form & Yup, backed by server-side validation in Express.
- **Ready for Deployment**: Fully configured for Vercel Serverless deployments (Monorepo setup).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, React Hook Form, Chart.js.
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs.
- **Database**: MongoDB Atlas.

---

## 📦 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) account (or local MongoDB)

### 2. Install Dependencies

You'll need to install dependencies in both the `client` and `server` directories.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables

Create a `.env` file in the **`server`** directory:

```env
# server/.env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

Create a `.env.local` file in the **`client`** directory:

```env
# client/.env.local
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Admin Data (Optional)

To create an initial admin account:

```bash
cd server
npm run seed
```
*Default login created: `president@shecanfoundation.org` / `admin123`*

### 5. Run the Application

You can run both servers simultaneously using a tool like `concurrently`, or run them in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌍 Deployment (Vercel)

This repository is pre-configured to be deployed as a single application on Vercel.

1. Push your code to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your GitHub repository.
4. Expand **Environment Variables** and add:
   - `MONGO_URI`: Your MongoDB string
   - `JWT_SECRET`: Your JWT Secret
5. Click **Deploy**.

Vercel will automatically build your Vite frontend and map your Express backend to `/api/*` using the included `vercel.json` configuration.

---

## 📄 License

This project was developed for the She Can Foundation. All rights reserved.
