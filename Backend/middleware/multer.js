const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key_here'
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Memory storage allows us to inspect buffer and upload to Cloudinary or save locally
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
});

/**
 * Saves media either to Cloudinary (if configured) or locally to /uploads.
 * Always resolves to a valid, reachable URL.
 */
const saveMedia = async (buffer, originalname, mimetype) => {
  if (!buffer) return '';

  // 1. Try Cloudinary if environment variables are set
  if (hasCloudinary) {
    try {
      const resourceType = mimetype && mimetype.startsWith('video/') ? 'video' : 'image';
      const cloudUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'ruh-dance', resource_type: resourceType },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
      });
      return cloudUrl;
    } catch (cloudErr) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
    }
  }

  // 2. Fallback: Save to backend /uploads directory
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalname || '') || (mimetype && mimetype.startsWith('video/') ? '.mp4' : '.jpg');
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, buffer);

  const baseUrl = process.env.BACKEND_URL || 'https://ruh-dance-project.onrender.com';
  return `${baseUrl}/uploads/${filename}`;
};

upload.saveMedia = saveMedia;
upload.uploadToCloudinary = saveMedia; // Backward-compatible alias

module.exports = upload;
