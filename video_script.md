# PostSphere - 3-Minute Video Presentation Script

Hello everyone! Today, I am excited to present **PostSphere**, a modern MERN stack application built inside a single monorepo. This video will focus on the user interface, the dynamic CRUD operations, and our production-ready image upload system.

---

Let's explore the user interface. We have built a highly responsive, dark-themed dashboard styled with custom CSS glassmorphism. The layout features modern typography, harmonized colors, and smooth micro-animations. 

The dashboard adapts perfectly to mobile screens and incorporates custom skeleton loaders that show up as placeholders while data is fetched, ensuring a premium user experience.

---

Now, let's look at the **Create** post feature. By clicking the 'Create Post' button, we open a glassmorphic modal. The form is backed by validation check boundaries. 

If I attempt to publish without inputs, error states are triggered. For the image upload, we support instant thumbnail previews. The file selector validates size limits up to 5MB and restricts formats to image files only.

When I select an image and click 'Publish Post', our upload process starts. An Axios interceptor captures the file stream progress and renders a dynamic percentage loading bar. Once complete, the post is saved to MongoDB, and the UI updates instantly with a success toast notification—all without needing a browser refresh.

---

Next are the **Update** and **Delete** actions. 

By clicking the edit button, the modal opens with pre-populated data. I can easily update the title or description, or swap the image, and save changes. 

If I click 'Delete', the application uses an **optimistic UI update**. The post card is immediately filtered out of the screen, and a delete request is sent to our Express backend. If the API returns an error, the card is rolled back onto the screen, and a warning toast appears. On success, the post metadata is deleted from MongoDB, and the image asset is securely removed from Cloudinary.

---

Under the hood, we use:
* **Multer memory storage** on the backend to pipe binary data directly to Cloudinary streams, storing only the secure URL in our database.
* **CORS configurations** to securely link our Vercel frontend with our Render API service.

This completes the walkthrough of PostSphere. We have a secure, responsive, and fully verified CRUD MERN application. Thank you for watching!
