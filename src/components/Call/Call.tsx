import React, { useState } from 'react';
import styles from './Call.module.scss';

export const Call = () => {
  const [input, setInput] = useState('');
  const [basicResponse, setBasicResponse] = useState('');
  const [detailResponse, setDetailResponse] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [loadingBasic, setLoadingBasic] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleBasicIngredientsSubmit = () => {
    const basicPrompt = `Jesteś asystentem ds. zakupów, napisz mi coś krótko na temat tego składu, czy jest ok, czy ograniczać, czy jest zdrowy. dwa krótkie zdania od asystenta, nie rozpisuj się. wyodrębnij skład z tego tekstu: ${ingredients}`;
    fetchGPTResponse(basicPrompt, setBasicResponse, setLoadingBasic);
  };

  const handleDetailIngredientsSubmit = () => {
      const detailPrompt = `Jako asystent do spraw zakupów podaj mi szczegóły na temat tego składu najważniejsze dla mojego zdrowia. napisz około 400 znaków ${ingredients}`;
      fetchGPTResponse(detailPrompt, setDetailResponse, setLoadingDetails);
  };

  const handleFollowUpQuestionSubmit = () => {
    if (input) {
      const followUpPrompt = `Biorąc pod uwagę poprzednie szczegółowe informacje: ${detailResponse}. Użytkownik pyta: "${input}". Proszę udzielić odpowiedzi.`;
      fetchGPTResponse(followUpPrompt, setFollowUpResponse, setLoadingFollowUp);
      setInput('');
    }
  };

  const testowo = () => {
    handleBasicIngredientsSubmit();
    handleDetailIngredientsSubmit();
  };
  const handleReset = () => {
    setBasicResponse('');
    setDetailResponse('');
    setFollowUpResponse('');
    setShowDetails(false);
    setInput('');
    setLoadingBasic(false);
    setLoadingDetails(false);
    setLoadingFollowUp(false);
  };

  return (
    <div className={styles.callContainer}>
      <button
        onClick={testowo}
        disabled={loadingBasic || loadingDetails || loadingFollowUp}
      >
        SKŁAD
      </button>

      <div className={styles.responseContainer}>
        {loadingBasic ? (
          <div className={styles.spinner}>Loading...</div>
        ) : (
          basicResponse &&
          !followUpResponse && (
            <p className={styles.response}>{basicResponse}</p>
          )
        )}

        {showDetails && !followUpResponse && (
          <>
            {loadingDetails ? (
              <div className={styles.spinner}>Loading...</div>
            ) : (
              detailResponse &&
              !followUpResponse && (
                <p className={styles.response}>{detailResponse}</p>
              )
            )}

            <input
              className={styles.inputField}
              type="text"
              placeholder="Dopytaj o szczegóły"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loadingFollowUp}
            />
            <button
              onClick={handleFollowUpQuestionSubmit}
              disabled={loadingFollowUp || !input}
            >
              Wyślij pytanie
            </button>
          </>
        )}
        {followUpResponse && (
          <p className={styles.response}>{followUpResponse}</p>
        )}

        {!showDetails && basicResponse && (
          <button
            className={styles.button}
            onClick={() => setShowDetails(true)}
            disabled={loadingDetails || loadingBasic}
          >
            {loadingDetails ? 'Ładowanie...' : 'Szczegóły'}
          </button>
        )}
        {basicResponse && (
          <button className={styles.button} onClick={handleReset}>
            Skanuj następne
          </button>
        )}
      </div>
    </div>
  );
};
