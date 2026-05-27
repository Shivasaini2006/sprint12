# PostSphere - Presentation Narration Script

Hello everyone! Today, I am excited to present **PostSphere**, a complete, production-ready MERN stack application. This project is structured as a **single-repository monorepo** where both the React + Vite frontend and the Node.js + Express backend run concurrently. In this video, I will walk you through the user interface, the underlying database schemas, the Level 3 image upload architecture, the automated tests, and the final production deployment on Vercel and Render.

---

Let's start with a quick live demonstration. We have a clean, modern, dark-themed dashboard styled with custom CSS glassmorphism, responsive cards, and micro-animations. 

I'll click 'Create Post'. Notice the image selector—it supports instant image preview and validates file sizes up to 5 Megabytes. When I click 'Publish Post', an Axios progress interceptor tracks the upload percentage. Once uploaded, the post appears instantly at the top of the feed without requiring a page refresh.

We can also update posts easily by opening the edit popover. When I click 'Delete', it uses an optimistic UI update—meaning the card is removed instantly from the screen, and the backend performs the deletion in the background, making the user experience feel incredibly fast and responsive.

---

Now, let's look at the codebase. As required, this is a clean monorepo. Under the root folder, we have the `client` directory which houses our React Vite frontend, and the `server` directory containing our Node.js backend. 

In the backend, we follow a clean MVC structure:
* Our `models/Post.js` file defines the Mongoose schema with validations for title, description, and image URL.
* Our `middlewares/upload.js` configures Multer using memory storage, which holds the image buffer in RAM instead of writing temp files to the disk.
* In `controllers/postController.js`, we pipe this buffer stream directly to Cloudinary using a modern Promise wrapper. Once uploaded, we store ONLY the Cloudinary secure URL in MongoDB. If a post is edited or deleted, we automatically trigger a command to delete the old image asset from Cloudinary to keep our storage clean.

---

To ensure reliability, I have configured an automated testing environment using **Vitest** and **React Testing Library**. 

I'll run `npm test` here in the terminal. As you can see, it runs 6 test cases verifying components rendering, empty states, error boundaries, client validations, and mock API fetches for our CRUD operations. All tests compile and pass successfully, demonstrating that the frontend states are robust.

---

For security, all API keys, database credentials, and Cloudinary secrets are managed using environment variables. Thanks to the `.gitignore` setup, these sensitive files remain strictly local and are never committed to GitHub.

For deployment:
* The Express backend is hosted on **Render** as a Web Service. The root directory is pointed to the `server/` folder, and the connection is active with MongoDB Atlas.
* The React frontend is deployed on **Vercel**, pointing to the `client/` folder.
* Both communicate securely via a production-ready CORS configuration that matches our deployed domains.

That completes the demonstration! We have a fully functioning, tested, secure, and production-deployed MERN application running smoothly from a single monorepo. Thank you for watching!
