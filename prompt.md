# Project Prompts Log - PostSphere Setup

This file catalogs the primary prompts, requests, and configuration details provided by the user to design, debug, and deploy the PostSphere MERN fullstack monorepo application.

---

## 1. Core Architecture Specifications (MERN Fullstack)

```text
I want to build this as a SINGLE REPOSITORY MERN FULL-STACK PROJECT (one repo, one root folder), not separate frontend/backend repositories.

You must generate a COMPLETE Level 3 production-ready MERN application using:

Frontend:
* React + Vite

Backend:
* Node.js + Express

Database:
* MongoDB + Mongoose

Cloud Storage:
* Cloudinary

File Upload Middleware:
* Multer

HTTP Client:
* Axios

Testing:
* React Testing Library + Vitest (or Jest if needed)

GOAL:
Create a fully integrated full-stack application where React frontend and Express backend run from the same repository and connect to MongoDB.

PROJECT STRUCTURE REQUIREMENT:
Create a professional monorepo structure like this:
project-root/
├── client/                (React + Vite frontend)
├── server/                (Node + Express backend)
├── README.md
├── package.json
└── .gitignore

ROOT PROJECT REQUIREMENTS:
Create root scripts so I can run both frontend and backend together.
Use concurrently package.
Root package.json scripts:
* npm run dev → run client + server together
* npm run client
* npm run server
* npm run build
* npm test
Install and configure everything automatically.

PHASE 1 — FULL FRONTEND/BACKEND INTEGRATION
1. Replace all dummy data or fake APIs.
2. Connect React frontend to Express backend API (http://localhost:5000/api/posts).
3. Use environment variables (VITE_API_URL, PORT, MONGO_URI, CLIENT_URL, CLOUDINARY_*).
4. Configure production-ready CORS (http://localhost:5173, deployed frontend URL).
5. Use Axios with centralized API service layer.
6. Implement useEffect data fetching.
7. Add proper loading and error states.

PHASE 2 — FULL CRUD SYSTEM
Create a COMPLETE CRUD system for posts (title, description, imageUrl, createdAt).
REQUIRED FEATURES:
* CREATE: React form, POST request, Save to MongoDB, Instantly update UI.
* READ: Fetch all posts, Responsive card UI, Proper loading state.
* DELETE: Delete button, Remove from MongoDB, Instant UI update.
* UPDATE: Edit button, Update form, PUT request, Optimistic UI update.
STATE MANAGEMENT: loading, submitting, success, error.
UX/UI: Spinners, Toast notifications, validation, skeletons, mobile-friendly design.

PHASE 3 — LEVEL 3 IMAGE UPLOAD SYSTEM
* DO NOT save images in MongoDB / Base64 / binary.
* Frontend: Use FormData.
* Backend: Use multer memoryStorage.
* Cloud: Upload files to Cloudinary.
* Database: Store ONLY Cloudinary URL string.
* Features: Preview, File type & size validation, progress indicators.

BACKEND: Modular routes, controllers, models, global error handler, asyncHandler.
TESTING: Component rendering, API fetches, form validation, CRUD mock runs.
DEPLOYMENT: Vercel (frontend) + Render (backend) monorepo routing config.
```

---

## 2. Configuration & Parameter Bindings

### Local Launch Request
```text
run localhost
```

### Database Inquiries & Configuration
```text
do you need the mongos api ?
```
```text
guide me where do find it from my mogdb account
```
```text
mongodb+srv://shivasaini2006_db:<db_password>@cluster0.a1u2jrl.mongodb.net/?appName=Cluster0
```
```text
shiva2416 is the pass
```

### Cloudinary Credentials & Troubleshooting
```text
383671133165137

GPp9oY6mQj72ff_0_Nx4VyWA0H0

these are the keys of both sceret key and api key
```
```text
name is root
```
*(Corrected to)*
```text
donmx76y8
```

---

## 3. Git & Deployment Workflows

```text
deploy kaha karu ?
```
```text
uspr git connect karke poora project manga lu na ?
```
```text
do alag alag folders h na client or server to client wala direct vercel upload kartra hu or dusra render pr
```
```text
pehle vercel pr karu ya render pr ?
```
```text
thik h pehle render pr upload kese karna h guide karo with steps
```
```text
pehle code push kardo safely without exposing apis
```
```text
Access to XMLHttpRequest at 'https://postsphere-api.onrender.com/api/posts' from origin 'https://sprint12-omega.vercel.app' has been blocked by CORS policy...
```

---

## 4. Refactoring Requests
```text
firstly remove the unccesary code lines from it and make this code humanize
```
```text
now make prompt.md and put the main prompts that i used
```
