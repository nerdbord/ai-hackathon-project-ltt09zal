import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VISION_KEY,
});

type Data = {
  text?: string;
  msg?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method Not Allowed' });
  }

  // check for image url
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ msg: 'Missing base64 image data' });
  }

  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Provide all the text visible on the image' },
            {
              type: 'image_url',
              image_url: {
                url: url,
              },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0]);

    res.status(200).json({
      text: response.choices[0].message.content ?? "",
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Ups, coś nie zesrało 💩' });
  }
}