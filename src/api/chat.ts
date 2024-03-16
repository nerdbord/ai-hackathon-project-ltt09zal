import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  answer: string;
};

export default async function postHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://training.nerdbord.io/api/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.API_GPT_KEY}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
        body: JSON.stringify({
          prompt: req.body.text,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      res.status(200).json({ answer: data.choices[0].text });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      res.status(500).json({ answer: 'Error processing your request' });
    }
  } else {
    // Respond with a 405 if a non-POST method is used
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ answer: `Method ${req.method} Not Allowed` });
  }
}