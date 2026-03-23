import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image file using Tesseract.js OCR.
 * @param file The image file to parse
 * @returns The extracted text as a promise
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    // Create a worker for the english language
    const worker = await Tesseract.createWorker('eng');
    
    // Create a temporary object URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    // Run the OCR process
    const ret = await worker.recognize(imageUrl);
    
    // Cleanup
    await worker.terminate();
    URL.revokeObjectURL(imageUrl);
    
    const extractedText = ret.data.text.trim();
    
    if (!extractedText || extractedText.length < 10) {
      throw new Error('Could not extract readable text from the image. Please use a clearer image or paste the text manually.');
    }
    
    return extractedText;
  } catch (error: any) {
    console.error('Error extracting text from image:', error);
    throw new Error(error.message || 'Failed to parse text from the image file. Please make sure it is a clear image or try pasting the text instead.');
  }
}
