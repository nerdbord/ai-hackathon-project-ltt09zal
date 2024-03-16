import { useState } from 'react';

export const Call = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const systemPrompt = "You are a helpful assistant.";
    const userPrompt = input;

    try {
      const res = await fetch('https://training.nerdbord.io/api/v1/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "TUTAJ WKLEJCIE KLUCZ Z ENVA",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              "role": "system",
              "content": systemPrompt,
            },
            {
              "role": "user",
              "content": userPrompt,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling GPT API:', error);
      setResponse('Error processing your request');
    }
  };

  return (
    <div style={{marginTop: '20px'}}>
      <span>napisz do czata</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Wyślij</button>
      <p>Odpowiedź: {response}</p>
    </div>
  );
};