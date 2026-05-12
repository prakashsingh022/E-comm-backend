const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary Configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.includes('video');
    const isPdf = file.mimetype.includes('pdf');
    
    return {
      folder: isVideo ? 'videos' : (isPdf ? 'documents' : 'products'),
      resource_type: 'auto',
      // Removing allowed_formats to avoid issues with auto-detection for videos
      // and to support more formats like .mov
    };
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
