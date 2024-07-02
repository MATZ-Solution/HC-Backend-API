const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dmythkwfu",
  api_key: "921459922168634",
  api_secret: "3Rh3ffbNq_71rGFVp2TCDG0Shwo",
});  
                                                                               

const fileFilter = (req, file, cb ) => {
  if (
    file.mimetype.startsWith("audio/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("application/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only image, video, and audio are allowed!"),
      false
    );
  }
};

// Create the Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "UPLOAD",
  allowedFormats: ["jpg", "jpeg", "png", "mp4", "pdf", "mpeg", "aac"],
  params: {
    resource_type: "auto",
    format: async (req, file) => {
      const fileExtension = file.originalname.split(".").pop();
      return fileExtension;
    },
    public_id: (req, file) =>
      `${Date.now().toString()}_${file.originalname.replace(/\.[^.]+$/, "")}`,
    fl_attachment: true,
  },
});

const upload = multer({
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
  storage: storage,
});

module.exports = upload;
