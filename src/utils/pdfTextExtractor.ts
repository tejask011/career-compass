import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the pdf.js worker using the local imported file
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    
    let fullText = '';

    // Iterate over all pages and extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        // Filter out TextMarkedContent or other items without a 'str' property
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
        .join(' ');
        
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to parse text from the PDF file. Please try pasting the text instead.');
  }
}
