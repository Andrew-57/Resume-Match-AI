// parser-worker.js

// Import required libraries from CDN
importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'
);

// Configure pdf.js worker
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

self.onmessage = async (e) => {
  const { file, type } = e.data;
  
  try {
    let text = '';
    
    if (type === 'pdf') {
      text = await parsePDF(file);
    } else if (type === 'docx') {
      text = await parseDOCX(file);
    } else {
      throw new Error(`Unsupported file type for worker: ${type}`);
    }
    
    self.postMessage({ fileText: text, error: null });
  } catch (error) {
    self.postMessage({ fileText: null, error: { message: error.message, name: error.name } });
  }
};

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  fullText = fullText.trim();
  
  if (fullText.length < 10) {
    const error = new Error('PDF appears to be image-based. Text extraction failed.');
    error.name = 'PDFTextExtractionError';
    throw error;
  }
  
  return fullText;
}

async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();
  
  if (text.length < 10) {
    const error = new Error('DOCX appears empty. Text extraction failed.');
    error.name = 'DOCXTextExtractionError';
    throw error;
  }
  
  return text;
}
