import { createWorker } from 'tesseract.js';

interface Output {
  ocrText: string;
  usedApiKeyNo: number;
}

export default async function ocr(
  base64Image: string,
  apiKeyNo: number
): Promise<Output> {
  if (!process.env.NEXT_PUBLIC_OCR_API_KEY) {
    throw new Error(`No api key specified!`);
  }

  const apiKeys = process.env.NEXT_PUBLIC_OCR_API_KEY.split(',');

  console.log(
    `Attempt with ${apiKeyNo + 1} API key of total ${apiKeys.length}.`
  );

  const myHeaders = new Headers();
  myHeaders.append('apikey', apiKeys[apiKeyNo]);
  const formData = new FormData();
  formData.append('language', 'pol');
  formData.append('isOverlayRequired', 'false');
  formData.append('base64Image', base64Image.toString());
  formData.append('filetype', 'png');
  formData.append('iscreatesearchablepdf', 'false');
  formData.append('issearchablepdfhidetextlayer', 'false');
  const url = `https://api.ocr.space/parse/image`;
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    });

    if (!response.ok && response.status === 403) {
      // change api key(10 req per 10 minutes of free tier) status: 403
      if (apiKeyNo > apiKeys.length - 1) {
        apiKeyNo = 0;
      } else {
        apiKeyNo++;
      }
      console.log(
        `Attempt with ${apiKeyNo + 1} API key of total ${apiKeys.length}.`
      );
      myHeaders.append('apikey', apiKeys[apiKeyNo]);
      response = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        body: formData,
      });
    }

    const data = await response.json();
    let ocrText = data.ParsedResults[0].ParsedText;

    // IF there is no data then try to recognize text using Tesseract OCR
    if (ocrText === '') {
      ocrText = await ocrTesseract(base64Image);
    }
    // When we recognize text using API then return the parsed data
    return { ocrText: ocrText, usedApiKeyNo: apiKeyNo };
  } catch (error) {
    // Try to recognize text using Tesseract OCR after API error
    const text = await ocrTesseract(base64Image);
    if (text) {
      return {
        ocrText: text,
        usedApiKeyNo: apiKeyNo,
      };
    }
    throw new Error(`Error proceeding OCR: ${error}`);
  }
}

// Proceed ocr with tesseract
async function ocrTesseract(base64Image: string): Promise<string> {
  // const processedImage = await preprocessImage(base64Image);
  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist:
      '0123456789aąbcćdeęfghijklłmnńoóprsśtuwvyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPRSSTUWVYZŹŻ -:,.?!/',
  });
  const {
    data: { text },
  } = await worker.recognize(base64Image);
  await worker.terminate();
  return text + '\n(generated with Tesseract)';
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
