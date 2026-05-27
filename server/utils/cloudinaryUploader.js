import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream.
 * Wraps the callback-based write stream in a modern Promise.
 *
 * @param {Buffer} fileBuffer - The memory buffer containing file binary
 * @param {string} folderName - The target Cloudinary folder name
 * @returns {Promise<object>} The Cloudinary upload result object containing secure_url etc.
 */
export const uploadBufferToCloudinary = (fileBuffer, folderName = 'posts') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve(result);
      }
    );

    // End the write stream by writing the buffer contents to it
    uploadStream.end(fileBuffer);
  });
};
