import express, { Request, Response } from "express";
import path from "path"; // Use path for constructing file paths
import { FileConverter } from "../utils/fileConverter"; // Import the FileConverter class
import upload from "../utils/upload";
import logger from "../logger";

const router = express.Router();

// Route to handle DOCX to PDF conversion
router.post(
  "/convert-docx-to-pdf",
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

export default router;
