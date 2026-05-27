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
