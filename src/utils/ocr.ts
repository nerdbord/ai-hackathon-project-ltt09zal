import { Image } from 'image-js';
import { createWorker } from 'tesseract.js';

async function ocr(base64Image: string) {
  try {
    // Load the image
    // const decodedString = atob(base64Image);
    // const byteArray = decodedString.split('').map(char => char.charCodeAt(0));
    // const image = new Image({ data: byteArray });

    // // Convert to grayscale
    // image.grey();
    // image.rotateLeft();
    // // Apply Gaussian blur for noise reduction
    // image.gaussianFilter();

    // // Invert the binary image
    // image.invert();

    // // Get the processed image as base64
    // const processedImg = image.toDataURL('image/png');

    // console.log("base64Image", base64Image)
    // console.log("processedImg", processedImg)

    // Recognize text using Tesseract OCR
    const worker = await createWorker('pol+eng');
    await worker.setParameters({
      tessedit_char_whitelist:
        '0123456789aąbcćdeęfghijklłmnńoóprsśtuwvzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPRSSTUWVYZŹŻ -:,.?!/',
    });

    const {
      data: { text },
    } = await worker.recognize(base64Image);
    await worker.terminate();

    return text ? text : 'Nic nie widzę w tym chmurzu';
  } catch (error) {
    console.error('Error:', error);
    return 'Ups, coś nie zesrało 💩';
  }
}

export default ocr;
