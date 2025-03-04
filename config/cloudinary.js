import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Custom storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: file.fieldname === 'thumbnail' 
        ? 'products/thumbnails' 
        : 'products/images',
      allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      public_id: `${file.fieldname}-${Date.now()}`,
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

// Middleware to handle file uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

export { upload };
export default cloudinary;