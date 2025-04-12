import multer, { FileFilterCallback } from "multer";
import path from "path";
import logger from "../logger";

// Define types for `file` parameter
interface File {
  originalname: string;
  mimetype: string;
}

// Set storage options (where to store files and naming convention)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Upload to "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename with timestamp
  },
});

// File filter to accept only DOCX files
const fileFilter = (
  req: Express.Request, // Correct type for the request object
  file: File, // File type as defined above
  cb: FileFilterCallback // Callback type from multer
) => {
  const allowedTypes = /docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  }

  // Log the error with file details
  const error = new Error("File type not allowed") as Error;
  logger?.error(
    `File upload error: ${error.message} for file: ${file.originalname} with MIME type: ${file.mimetype}`
  );

  // Reject the file with the error
  return cb(error); // No need to pass 'false' here because the error itself indicates rejection
};

// Set up the Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB
});

export default upload;
