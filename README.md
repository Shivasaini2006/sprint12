# PostSphere - Production-Ready MERN Fullstack Application

PostSphere is a high-performance, responsive monorepo MERN stack application designed for creating, reading, updating, and deleting posts with dynamic image uploads powered by Cloudinary and Multer.

## 🚀 Key Features

* **Single Repo Architecture**: Fully integrated frontend and backend in one repository, managed with concurrent dev scripts.
* **Level 3 Image Uploads**: Binary files are parsed using Multer `memoryStorage` and uploaded directly via stream to Cloudinary. Only secure URLs are stored in MongoDB. Old assets are cleaned up on update and delete.
* **State Management & UX/UI**: Implements loading spinners, skeleton placeholders, Toast notifications, error boundaries, and optimistic UI updates for delete operations.
* **Resilient Middleware**: Custom centralized error handling, Mongoose schema validators, and Express `asyncHandler` wrappers prevent server crashes.
* **Vitest Testing**: Comprehensive client testing suite covers all key UI states, form entries, validation errors, and API mocks.

---

## 📂 Project Structure

```
project-root/
│
├── client/                (React + Vite frontend)
│   ├── src/
│   │   ├── components/    (Toast, SkeletonLoader, PostCard, PostForm)
│   │   ├── services/      (api.js custom Axios service layer)
│   │   ├── test/          (App.test.jsx Vitest suite)
│   │   ├── App.jsx        (Client orchestration and layouts)
│   │   └── main.jsx       (React bootstrap)
│   ├── public/
│   ├── package.json
│   └── .env               (Client configuration)
│
├── server/                (Node + Express backend)
│   ├── config/            (db.js, cloudinary.js)
│   ├── controllers/       (postController.js CRUD actions)
│   ├── models/            (Post.js Mongoose Schema)
│   ├── routes/            (postRoutes.js API routes)
│   ├── middlewares/       (upload.js Multer, errorHandler.js)
│   ├── utils/             (asyncHandler.js, cloudinaryUploader.js)
│   ├── server.js          (Server setup)
│   ├── package.json
│   └── .env               (Secret keys)
│
├── README.md
├── package.json           (Root package orchestrator)
└── .gitignore
```

---

## 🛠️ Local Startup Guide

### 1. Installation
Install all root, client, and server dependencies recursively:
```bash
npm run install:all
```

### 2. Environment Configuration
Create `.env` configuration files in their respective folders:

* **In `/server/.env`**:
  ```env
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/postdb
  CLIENT_URL=http://localhost:5173
  CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
  CLOUDINARY_API_KEY=your_cloudinary_api_key
  CLOUDINARY_API_SECRET=your_cloudinary_api_secret
  NODE_ENV=development
  ```

* **In `/client/.env`**:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

### 3. Run Development Server
Boot both client and server concurrently:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Tests
Verify all client component layouts, validation triggers, and CRUD logic states:
```bash
npm test
```

---

## 🌐 Production Deployment

### Backend (Render, Heroku, or similar)
1. Set the **Root Directory** to `server`.
2. Configure **Build Command** to `npm install`.
3. Configure **Start Command** to `npm start`.
4. Inject your environment variables (`MONGO_URI`, `CLOUDINARY_*`, `CLIENT_URL`, etc.).

### Frontend (Vercel, Netlify, or similar)
1. Set the **Root Directory** to `client`.
2. Configure **Build Command** to `npm run build`.
3. Configure **Output Directory** to `dist`.
4. Set `VITE_API_URL` to point to your deployed backend domain.
