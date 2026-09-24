import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name || 'document';
    const isPdf = file.type === 'application/pdf' || filename.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        const extractedText = result.text || '';
        await parser.destroy();

        if (extractedText.trim().length > 0) {
          return NextResponse.json({
            success: true,
            text: extractedText.trim(),
            filename,
            pages: result.total || 1,
            type: 'pdf'
          });
        }
      } catch (pdfErr: any) {
        console.warn('PDFParse standard extractor warning:', pdfErr.message);
      }

      // Fallback: extract textual strings from PDF text streams
      const rawString = buffer.toString('latin1');
      const textMatches: string[] = [];
      const streamRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*(?:Tj|'|")/g;
      let match;
      while ((match = streamRegex.exec(rawString)) !== null) {
        const cleaned = match[1].replace(/\\([()\\])/g, '$1');
        if (cleaned.length > 1) {
          textMatches.push(cleaned);
        }
      }

      const fallbackText = textMatches.join(' ');
      if (fallbackText.length > 20) {
        return NextResponse.json({
          success: true,
          text: fallbackText,
          filename,
          type: 'pdf_stream'
        });
      }

      return NextResponse.json({
        success: false,
        error: 'No readable text layer found in PDF. If this is a scanned photo PDF, please upload as JPG/PNG or use Camera Scanner.'
      }, { status: 422 });
    }

    // Text files (.txt, csv, etc.)
    if (file.type.startsWith('text/') || filename.endsWith('.txt') || filename.endsWith('.csv')) {
      const text = buffer.toString('utf-8');
      return NextResponse.json({
        success: true,
        text,
        filename,
        type: 'text'
      });
    }

    // For image files, indicate client OCR should handle or pass through
    return NextResponse.json({
      success: true,
      filename,
      type: 'image',
      message: 'Image received for OCR pipeline'
    });
  } catch (error: any) {
    console.error('API /extract-text error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
