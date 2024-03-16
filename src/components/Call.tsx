import { useState } from 'react';

export const Call = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.API_KEY_GPT}`,
        },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.answer);
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
}
