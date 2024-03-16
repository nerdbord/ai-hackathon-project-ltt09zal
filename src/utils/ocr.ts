import { createWorker } from 'tesseract.js';

export default async function ocr(base64Image: string) {
  const url = `https://api.ocr.space/parse/image`;

  const myHeaders = new Headers();
  myHeaders.append('apikey', 'helloworld');

  const formData = new FormData();
  formData.append('language', 'pol');
  formData.append('isOverlayRequired', 'false');
  formData.append('base64Image', base64Image.toString());
  formData.append('filetype', 'png');
  formData.append('iscreatesearchablepdf', 'false');
  formData.append('issearchablepdfhidetextlayer', 'false');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status: ${response.status}. Message: ${response.json}`
      );
    }

    const data = await response.json();
    let ocrText = data.ParsedResults[0].ParsedText;
    if (ocrText === '') { // Try to recognize text using Tesseract OCR
      ocrText = await ocrTesseract(base64Image);
    }
    return ocrText;
  } catch (error) {
    const text = await ocrTesseract(base64Image); // Try to recognize text using Tesseract OCR
    if (text) {
      return text;
    }
    throw new Error(`Error proceeding OCR: ${error}`);
  }
}

// Proceed ocr with tesseract
async function ocrTesseract(base64Image: string): Promise<string> {
  const processedImage = await preprocessImage(base64Image);
  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist:
      '0123456789aąbcćdeęfghijklłmnńoóprsśtuwvyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPRSSTUWVYZŹŻ -:,.?!/',
  });
  const {
    data: { text },
  } = await worker.recognize(processedImage);
  await worker.terminate();
  return text+"\n(generated with Tesseract)";
}

// Preprocess image (for tesseract)
async function preprocessImage(base64Image: string): Promise<string> {
  const response = await fetch('/api/process-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64Image: base64Image.replace('data:image/png;base64,', ''),
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  const data = await response.json(); // data.img - base64image
  return data.img;
}
