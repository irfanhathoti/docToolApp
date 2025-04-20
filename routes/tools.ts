// routes/tools.ts
import express, { Request, Response } from "express";
import upload from "../utils/upload"; // Multer file upload
import path from "path"; // Use path for constructing file paths
import fs from "fs";
import sharp from "sharp"; // Image compression library
import { FileConverter } from "../utils/fileConverter"; // Import the FileConverter class
import { PDFDocument } from "pdf-lib";
import logger from "../logger";
import { checkAnonymousLimit } from "../middleware/checkAnonymousLimit";
import { checkCredits } from "../middleware/checkCredits";

const router = express.Router();

// Route to handle DOCX to PDF conversion
router.post(
  "/convert-docx-to-pdf",
  checkAnonymousLimit,
  checkCredits,
  upload.single("docx"),
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const docxFilePath = req.file.path; // Path of the uploaded DOCX file
      const outputPdfPath = path.join(
        "uploads",
        `converted-${req.file.filename}.pdf`
      ); // Path to save the converted PDF file

      // Perform DOCX to PDF conversion using the FileConverter class
      await FileConverter.convertDocxToPdf(docxFilePath, outputPdfPath);

      // Respond with a downloadable URL
      const fileUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(outputPdfPath)}`;
      res.status(200).json({
        message: "DOCX to PDF conversion successful",
        file: fileUrl, // Provide the URL to download the PDF
      });
    } catch (error) {
      logger?.error(error);
      res.status(500).json({
        message: "Conversion failed",
        error: (error as Error).message,
      });
    }
  }
);

// Image compression route
router.post(
  "/compress-image",
  checkAnonymousLimit,
  checkCredits,
  upload.single("image"),
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const filePath = req.file.path; // Path of the uploaded image file
      const outputPath = path.join(
        "uploads",
        `compressed-${req.file.filename}`
      );

      // Compress image using sharp
      await sharp(filePath)
        .resize(800) // Resize image to max 800px width
        .jpeg({ quality: 80 }) // Compress JPEG (quality 80)
        .toFile(outputPath); // Output the compressed image

      // Optionally, delete the original file after compression
      fs.unlinkSync(filePath);

      res
        .status(200)
        .json({ message: "Image compressed successfully", file: outputPath });
    } catch (error) {
      logger?.error(error);
      res.status(500).json({
        message: "Image compression failed",
        error: (error as Error).message,
      });
    }
  }
);

// PDF compression route
router.post(
  "/compress-pdf",
  checkAnonymousLimit,
  checkCredits,
  upload.single("pdf"),
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const filePath = req.file.path; // Path of the uploaded PDF file
      const outputPath = path.join(
        "uploads",
        `compressed-${req.file.filename}`
      );

      // Load the PDF and reduce file size using pdf-lib (basic example)
      const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));

      // Saving the PDF (this will remove unnecessary data)
      const compressedPdfBytes = await pdfDoc.save();

      // Write the compressed PDF to a new file
      fs.writeFileSync(outputPath, compressedPdfBytes);

      // Optionally, delete the original file after compression
      fs.unlinkSync(filePath);

      res
        .status(200)
        .json({ message: "PDF compressed successfully", file: outputPath });
    } catch (error) {
      logger?.error(error);
      res.status(500).json({
        message: "PDF compression failed",
        error: (error as Error).message,
      });
    }
  }
);

export default router;
