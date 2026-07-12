
# Store Rating System — Frontend (React + Vite)

A frontend for the **Store Rating System** built with **React 18** and **Vite**.  
This app is the client for a backend API (Express + Sequelize) and supports three roles:

- **Normal User** — browse stores, give/update ratings, edit profile  
- **Store Owner** — view ratings for their store(s) and see who rated them  
- **Admin** — manage users, stores and view dashboard stats

---

## Table of Contents

- [Demo](#demo)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [API and axios configuration](#api-and-axios-configuration)
- [Auth & routing](#auth--routing)
- [Key pages & features](#key-pages--features)
- [Deployment notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)

---



## Tech stack

- React 18
- Vite
- Axios
- React Router DOM
- Context API for auth
- Plain CSS (no Tailwind)

---


The system supports three user roles:

Normal User → View stores, rate stores, update ratings

Store Owner → View all ratings given to their store

Admin → Manage users, stores, dashboard statistics

This README explains setup, environment variables, scripts, and project purpose.

##🚀 Tech Stack

React 18

Vite

Axios (API integration)

React Router DOM

Context API (Authentication)

Custom
---
---

## 🔧 Environment Variables

Create a **.env** file in the root of your frontend directory:

VITE_API_BASE_URL=http://localhost:5000/api

Note: Only variables prefixed with VITE_ are exposed and available inside the React application (due to Vite configuration).

---

## 🧑‍💻 Setup Instructions

### 1. Install dependencies

npm install

### 2. Start development server

npm run dev

### 3. Build for production

npm run build

### 4. Preview production build (optional)

npm run preview

---

## 🔌 API Configuration

The api/axiosClient.js file handles base URL configuration and JWT token injection for all requests.

```javascript
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
