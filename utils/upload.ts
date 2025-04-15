// utils/upload.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import logger from "../logger"; // Assuming you have a logger utility to log messages

// Define types for the file parameter
interface File {
  originalname: string;
  mimetype: string;
}

// Ensure the uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create 'uploads' directory if it doesn't exist
}

// Set storage options (where to store files and naming convention)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`; // Unique filename with timestamp
    logger?.info(
      `File uploaded successfully: ${file.originalname}, saved as: ${uniqueFileName}`
    );
    cb(null, uniqueFileName); // Save the file with a unique name
  },
});

// File filter to accept DOCX, PDF, images, and text files
const fileFilter = (
  req: Express.Request,
  file: File,
  cb: FileFilterCallback
) => {
  // Allowed file extensions and MIME types
  const allowedExtensions = [".docx", ".pdf", ".txt", ".jpg", ".jpeg", ".png"];
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX MIME type
    "application/pdf", // PDF MIME type
    "text/plain", // Plain text MIME type
    "image/jpeg", // JPEG MIME type
    "image/png", // PNG MIME type
  ];

  // Check file extension
  const extname = allowedExtensions.includes(
    path.extname(file.originalname).toLowerCase()
  );

  // Check MIME type
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file if it's of allowed type
  }

  // Log the error with file details
  const error = new Error("File type not allowed") as Error;
  logger?.error(
    `File upload error: ${error.message} for file: ${file.originalname} with MIME type: ${file.mimetype}`
  );

  return cb(error); // Reject the file with the error
};

// Set up the Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
});

export default upload;
