import { createWorker } from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

/**
 * Runs optical character recognition (OCR) on an image file, blob, or data URL.
 */
export async function recognizeImageWithOCR(
  imageSource: string | File | Blob,
  onProgress?: (progress: OCRProgress) => void
): Promise<string> {
  try {
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (onProgress && m.status) {
          onProgress({
            status: m.status,
            progress: Math.round((m.progress || 0) * 100)
          });
        }
      }
    });

    const ret = await worker.recognize(imageSource);
    await worker.terminate();

    return ret.data.text || '';
  } catch (error) {
    console.error('OCR processing error:', error);
    throw error;
  }
}
