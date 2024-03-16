import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';
import sharp from 'sharp';

type Data = {
  text?: string;
  msg?: string;
  img?: string;
};

export default async function processImage(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  const { base64Image } = req.body;
  if (!base64Image) {
    return res.status(400).json({ msg: 'Missing base64 image data' });
  }

  try {
    const buffer = Buffer.from(
      base64Image.replace(/[^A-Za-z0-9+/=]/g, ''),
      'base64'
    );
    // Preprocess the image for better OCR results
    const image = sharp(buffer);
    image.greyscale();
    image.normalize();
    // image.blur();
    // image.sharpen();
    image.threshold(90);
    const processedImg = await image.toBuffer();

    const base64Img =
      'data:image/png;base64,' + processedImg.toString('base64');

    res.status(200).json({
      img: base64Img,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Ups, coś nie zesrało 💩' });
  }
}
