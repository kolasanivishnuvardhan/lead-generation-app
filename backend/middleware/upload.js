const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/');

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed! Please upload JPG, PNG, GIF, or WEBP files.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Image cropping function (450x350 ratio as per requirements)
const cropImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(450, 350, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);
    
    // Delete the original temp file
    fs.unlinkSync(inputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error('Image processing failed: ' + error.message);
  }
};

module.exports = { upload, cropImage };
