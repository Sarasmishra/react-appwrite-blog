# 📝 Blog Platform

A production-grade blog/content platform built using **React, Redux Toolkit, Appwrite, Tailwind CSS, and Shadcn UI**.  
This project focuses on real-world SaaS patterns, clean architecture, and scalable frontend development.



## 🚀 Live Demo
Vercel -> https://react-appwrite-blog-tau.vercel.app/



## 📌 Project Overview

This is a modern blog platform where users can:
- Authenticate securely
- Create and manage rich blog posts
- Interact through likes, bookmarks, and comments
- Browse content using search, tags, and pagination
- Switch between dark mode and color themes

The project is designed to be **resume-worthy and interview-ready**, not a tutorial clone.

---

## ✨ Features

### 🔐 Authentication
- Email/password authentication (Appwrite)
- Session persistence on reload
- Protected routes
- Logout confirmation dialog

### 📝 Blog Posts
- Create, edit, delete posts
- Rich text editor
- Draft & published states
- Slug-based routing
- Cover image upload (Appwrite Storage)
- Author-only edit/delete permissions

### ❤️ User Engagement
- Like system (per user per post)
- Bookmark posts
- Comment system
  - Add & delete comments
  - User-based permissions
  - Optimistic UI updates

### 🔍 Discovery
- Search posts by title/content
- Category filtering
- Tag filtering
- Client-side pagination
- Skeleton loaders & empty states

### 🎨 UI / UX
- Shadcn UI components
- Tailwind CSS with design tokens
- Dark / light mode
- Multiple color themes
- Responsive layout
- Accessible dialogs and controls

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- React Router v6
- Redux Toolkit
- Redux Thunks
- Tailwind CSS
- Shadcn UI
- Lucide Icons

### Backend as a Service
- Appwrite
  - Authentication
  - Databases
  - Storage
  - Permissions

### Utilities
- react-hot-toast
- Custom theme utilities

---

## 🏗 Project Architecture

src/
├── app/ # Appwrite config & services
├── layouts/ # AppLayout with Navbar + Outlet
├── components/ # Reusable components
│ └── ui/ # Shadcn UI components
├── pages/ # Route-based pages
├── redux/
│ ├── auth/
│ ├── posts/
│ ├── likes/
│ ├── bookmarks/
│ ├── comments/
│ └── store.js
├── utils/ # Theme & helper utilities
└── main.jsx


---

## 🔐 Appwrite Permissions

### Posts
- Create → Authenticated users
- Read → Public
- Update/Delete → Author only

### Comments
- Create → Authenticated users
- Read → Public
- Delete → Comment owner

### Likes & Bookmarks
- One entry per user per post
- Indexed by `postId` and `userId`

---

## 🎯 Design Decisions

- Appwrite chosen to focus on frontend architecture
- Client-side pagination for limited datasets
- Optimistic UI for likes and comments
- Premium membership designed conceptually (not implemented)
- Feature scope intentionally frozen to avoid overengineering

---

## 💡 Premium Membership (Conceptual)

Premium membership is **designed but not implemented**.

In a real-world system, this would include:
- Stripe / Razorpay integration
- Backend webhook verification
- Secure membership activation
- Expiry handling via cron jobs

This project demonstrates the **UI and access-control layer only**.

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_BUCKET_ID=
```

## 🧪 Run Locally
-npm install
-npm run dev


##👤 Author

Saras Mishra
Frontend Developer
