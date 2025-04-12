import express, { Request, Response } from "express";
import path from "path"; // Use path for constructing file paths
import { FileConverter } from "../utils/fileConverter"; // Import the FileConverter class
import upload from "../utils/upload";

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
      ); // Use path to construct PDF path

      // Perform DOCX to PDF conversion using the FileConverter class
      await FileConverter.convertDocxToPdf(docxFilePath, outputPdfPath);

      res.status(200).json({
        message: "DOCX to PDF conversion successful",
        file: outputPdfPath,
      });
    } catch (error) {
      res.status(500).json({
        message: "Conversion failed",
        error: (error as Error).message,
      });
    }
  }
);

export default router;
