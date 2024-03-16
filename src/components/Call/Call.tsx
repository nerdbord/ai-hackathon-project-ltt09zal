import React, { useState } from 'react';
import styles from './Call.module.scss';

export const Call = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [detailResponse, setDetailResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [isFirstResponseHidden, setIsFirstResponseHidden] = useState(false);

  const fetchGPTResponse = async (
    prompt: string,
    setResponseFunction: Function,
    setLoadingFunction: Function
  ) => {
    setLoadingFunction(true);
    try {
      const res = await fetch(
        'https://training.nerdbord.io/api/v1/openai/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${process.env.NEXT_PUBLIC_API_KEY_GPT}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponseFunction(data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling GPT API:', error);
      setResponseFunction('Error processing your request');
    }
    setLoadingFunction(false);
  };

  const ingredients =
    'przecier pomidorowy 62%, cukier, ocet, sól, skrobia kukurydziana modyfikowana, aromat naturalny. Produkt może zawierać seler.';

  const handleIngredientsSubmit = () => {
    if (queryCount === 0) {
      const basicPrompt = `Jesteś asystentem ds. zakupów, napisz mi coś krótko na temat tego składu, czy jest ok, czy ograniczać, czy jest zdrowy. dwa krótkie zdania od asystenta, nie rozpisuj się. wyodrębnij skład z tego tekstu: ${ingredients}`;
      fetchGPTResponse(basicPrompt, setResponse, setLoading);

      const detailPrompt = `Jako asystent do spraw zakupów podaj mi szczegóły na temat tego składu najważniejsze dla mojego zdrowia. napisz około 400 znaków ${ingredients}`;
      fetchGPTResponse(detailPrompt, setDetailResponse, setLoadingDetails);

      setQueryCount(1);
    }
  };

  const handleShowDetails = () => {
    setShowDetails(true);
    setQueryCount(2);
    setIsFirstResponseHidden(true);
  };

  const handleQuestionSubmit = () => {
    if (queryCount === 2 && input) {
      const detailQuestionPrompt = `Opierając się na poprzedniej odpowiedzi dotyczącej szczegółów: ${detailResponse}, użytkownik pyta: "${input}". Proszę udzielić krótkiej odpowiedzi.`;
      fetchGPTResponse(detailQuestionPrompt, setResponse, setLoading);
      setShowDetails(false);
      setQueryCount(3);
      setInput('');
    }
  };

  const handleReset = () => {
    setResponse('');
    setDetailResponse('');
    setShowDetails(false);
    setQueryCount(0);
    setInput('');
    setLoading(false);
    setLoadingDetails(false);
    setIsFirstResponseHidden(false);
  };

  return (
    <div className={styles.callContainer}>
      {queryCount === 0 && (
        <button
          onClick={handleIngredientsSubmit}
          disabled={loading || loadingDetails}
        >
          SKŁAD
        </button>
      )}

      <div className={styles.responseContainer}>
        {loading || loadingDetails ? (
          <div className={styles.spinner}>Loading...</div>
        ) : (
          <>
            {response && !isFirstResponseHidden && (
              <p className={styles.response}>{response}</p>
            )}

            {queryCount === 3 && <p className={styles.response}>{response}</p>}

            {queryCount >= 1 && !showDetails && (
              <button
                className={styles.button}
                onClick={handleShowDetails}
                disabled={loadingDetails}
              >
                {loadingDetails ? 'Ładowanie...' : 'Szczegóły'}
              </button>
            )}

            {showDetails && detailResponse && (
              <p className={styles.response}>{detailResponse}</p>
            )}

            {queryCount === 2 && (
              <>
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="Dopytaj o szczegóły"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleQuestionSubmit} disabled={loading}>
                  Wyślij pytanie
                </button>
              </>
            )}

            {queryCount > 0 && (
              <button className={styles.button} onClick={handleReset}>
                Skanuj następne
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
