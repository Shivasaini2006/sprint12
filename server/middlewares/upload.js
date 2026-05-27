import multer from 'multer';

// Use memory storage so file is buffered in memory as a Buffer object,
// which can then be directly streamed to Cloudinary without storing local temp files.
const storage = multer.memoryStorage();

/**
 * Filter uploaded files to ensure only images are accepted.
 */
const fileFilter = (req, file, cb) => {
  // Accepted mime types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed!'), false);
  }
};

// Limit file size to 5MB
const limits = {
  fileSize: 5 * 1024 * 1024 // 5 Megabytes
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

// We want to export it so we can use upload.single('image') in our router
export default upload;
