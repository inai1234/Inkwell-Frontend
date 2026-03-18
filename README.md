<<<<<<< HEAD
# 🖊️ Inkwell Blog — Full Stack Setup Guide

## 📁 Project Structure

```
inkwell/                    ← Your existing main website (React + Vite)
inkwell-backend/            ← NEW: Express.js API server (port 3000)
inkwell-admin/              ← NEW: React Admin Panel (port 5174)
```

---

## ⚡ Quick Start (Step by Step)

### Step 1 — Install & Start Backend

```bash
cd inkwell-backend
npm install
node seed.js          # Seeds admin user + categories + sample posts
npm run dev           # Starts server on http://localhost:3000
```

**Default Admin Credentials (from .env):**
- Email: `admin@inkwell.com`
- Password: `admin123`

### Step 2 — Install & Start Admin Panel

```bash
cd inkwell-admin
npm install
npm run dev           # Starts on http://localhost:5174
```

### Step 3 — Start Main Website

```bash
cd inkwell              # (your existing project folder)
npm run dev             # Starts on http://localhost:5173
```

---

## 🗄️ MongoDB Setup (Local)

1. Install MongoDB Community: https://www.mongodb.com/try/download/community
2. Start MongoDB service: `mongod` or via MongoDB Compass
3. The `.env` file is already configured for: `mongodb://localhost:27017/inkwell_db`
4. Connect MongoDB Compass to: `mongodb://localhost:27017`
5. Database name: `inkwell_db`

---

## 🔌 All API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT token |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| PUT | `/api/auth/change-password` | Change password (protected) |
| GET | `/api/auth/users` | Get all users (admin only) |

### Blogs (Public)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/blogs` | Get published blogs (pagination, search, filter) |
| GET | `/api/blogs/:slug` | Get single blog by slug |

### Blogs (Protected)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/blogs/admin` | Get all blogs for admin panel |
| POST | `/api/blogs` | Create new blog post |
| PUT | `/api/blogs/:id` | Update blog post |
| PATCH | `/api/blogs/:id/status` | Quick status change |
| DELETE | `/api/blogs/:id` | Delete blog post |
| GET | `/api/blogs/stats/overview` | Dashboard statistics |

### Categories
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category + its blogs |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Upload
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/upload/image` | Upload image (protected) |

### Health
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Server health check |

---

## 🔑 Authentication

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

The admin panel stores the token in `localStorage` and sends it automatically.

---

## 📋 Blog Post Fields

```json
{
  "title": "Post Title",
  "excerpt": "Short description (max 500 chars)",
  "content": "<p>Full HTML content...</p>",
  "coverImage": "https://... or /uploads/filename.jpg",
  "category": "Technology",
  "tags": ["ai", "tech"],
  "status": "draft | published | archived",
  "featured": false,
  "metaTitle": "SEO title (optional)",
  "metaDescription": "SEO description (optional)"
}
```

---

## 🔄 How Admin → Main Website Works

1. You add/edit a blog in the **Admin Panel** (`localhost:5174`)
2. It's saved to **MongoDB** via the **Backend API** (`localhost:3000`)
3. The **Main Website** (`localhost:5173`) fetches blogs from the API
4. If the API is down, the main website gracefully falls back to static data

---

## 🛠️ .env Configuration

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inkwell_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@inkwell.com
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

---

## 📦 Tech Stack

| Part | Stack |
|------|-------|
| Main Website | React 18, Vite, Tailwind CSS, React Router |
| Admin Panel | React 18, Vite, Tailwind CSS, Axios |
| Backend API | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| File Upload | Multer |

---

## 🐛 Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running: `sudo systemctl start mongod` (Linux) or start MongoDB Compass
- Check the connection string in `.env`

**CORS errors?**
- Ensure both frontend URLs are in `.env` (CLIENT_URL and ADMIN_URL)
- Backend is configured to allow both ports 5173 and 5174

**Admin login not working?**
- Run `node seed.js` to create the admin user first
- Default credentials: `admin@inkwell.com` / `admin123`

**Main website not showing new blogs?**
- Make sure backend is running on port 3000
- Published blogs appear on the main website automatically
- Draft blogs are only visible in the admin panel
=======
# Inkwell-Admin
>>>>>>> 9f5cded92d06b256b9bbee7fd5f080b27df0c474
