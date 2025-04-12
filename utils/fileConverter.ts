import puppeteer from "puppeteer";
import fs from "fs";
import mammoth from "mammoth"; // Converts DOCX to HTML

export class FileConverter {
  // Convert DOCX to PDF
  public static async convertDocxToPdf(
    docxFilePath: string,
    outputPdfPath: string
  ): Promise<void> {
    try {
      // Step 1: Convert DOCX to HTML using Mammoth
      const html = await FileConverter.convertDocxToHtml(docxFilePath);

      // Step 2: Use Puppeteer to render HTML to PDF
      await FileConverter.convertHtmlToPdf(html, outputPdfPath);

      // Optionally, delete the original DOCX file after conversion
      fs.unlinkSync(docxFilePath); // Deleting original DOCX file to save space
    } catch (error) {
      throw new Error(
        `Error during DOCX to PDF conversion: ${(error as Error).message}`
      );
    }
  }

  // Helper method: Convert DOCX to HTML using Mammoth
  private static async convertDocxToHtml(
    docxFilePath: string
  ): Promise<string> {
    try {
      // Using the Promise-based API of Mammoth
      const result = await mammoth.convertToHtml({ path: docxFilePath });
      return result.value; // Returns the HTML content
    } catch (error) {
      throw new Error("DOCX to HTML conversion failed");
    }
  }

  // Helper method: Convert HTML to PDF using Puppeteer
  private static async convertHtmlToPdf(
    htmlContent: string,
    outputPdfPath: string
  ): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPdfPath, format: "A4" });
    await browser.close();
  }
}
