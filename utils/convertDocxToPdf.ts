import puppeteer from "puppeteer";
import mammoth from "mammoth";

async function convertDocxToPdf(docxFilePath: string, outputPdfPath: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load DOCX file and convert to HTML
  const docxHtml = await mammoth.convertToHtml({ path: docxFilePath });

  // Render the HTML content as a page and convert to PDF
  await page.setContent(docxHtml.value);
  await page.pdf({ path: outputPdfPath, format: "A4" });

  await browser.close();
}

export default convertDocxToPdf
