import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure env variables are loaded if executing this module in isolation (e.g. tests)
dotenv.config();

/**
 * Configure Cloudinary with keys from the environment variables.
 */
const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      'WARNING: Cloudinary credentials are incomplete in the environment. Image uploads will fail.'
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });

  return cloudinary;
};

// Initialize configuration
configureCloudinary();

export default cloudinary;
