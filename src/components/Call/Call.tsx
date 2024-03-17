'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Call.module.scss';
import { useStore } from '@/store/useStore';
import Button from '../Button/Button';
import OpenAI from 'openai';
import PhotoUpload from '../PhotoUpload/PhotoUpload';
export const Call = () => {
  const [input, setInput] = useState<string>('');

  const [detailResponse, setDetailResponse] = useState<string>('');
  const [followUpResponse, setFollowUpResponse] = useState<string>('');
  const [loadingBasic, setLoadingBasic] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [loadingFollowUp, setLoadingFollowUp] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  // const [imageUrl, setImageUrl] = useState<string>(
  //   'https://sdpl.b-cdn.net/17158-large_default/obrazek-obrazki-10paz.jpg'
  // );
  const {
    initCamera,
    startOcr,
    textOcr,
    setTextOcr,
    setStartOcr,
    setOpen,
    open,
    imageUrl,
    setImageUrl,
    basicResponse,
    setBasicResponse,
  } = useStore();

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

  const responseImg = async () => {
    setLoadingBasic(true); // Rozpoczęcie ładowania
    console.log(imageUrl);
    try {
      const response = await fetch('/api/vision-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });
      const data = await response.json();
      console.log('to wyczytal:', data.text);
      setTextOcr(data.text);
    } catch (error) {
      console.error('Error calling OpenAI:', error);
    }
    setImageUrl('')
    setLoadingBasic(false);
  };

  const ingredients = textOcr;
  // const ingredients =
  //   'olej rzepakowy, żółtko jaja 6%, ocet, musztarda (woda, gorczyca, ocet, sól, cukier, przyprawy, aromat), cukier, sól, przyprawy, przeciwutleniacz (sól wapniowo-disodowa EDTA), regulator kwasowości (kwas cytrynowy).';

  const handleBasicIngredientsSubmit = () => {
    const basicPrompt = `jako asystent ds. zakupów, napisz mi coś krótko na temat tego składu: ${ingredients}. Czy jest zdrowy, czy mam go ograniczać, czy jest szkodliwy itd. dwa krótkie zdania od asystenta, nie rozpisuj się.`;
    fetchGPTResponse(basicPrompt, setBasicResponse, setLoadingBasic);
  };

  const handleDetailIngredientsSubmit = () => {
    const detailPrompt = `jako asystent do spraw zakupów podaj mi szczegóły na temat tego składu: ${ingredients}. Wypisz te najważniejsze dla mojego zdrowia. napisz około 250 znaków.`;
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
    setImageUrl('')
    setOpen(false)
  };
  useEffect(() => {
    if (textOcr) {
      testowo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textOcr]);
  return (
    <div className={styles.callContainer}>

      {!basicResponse && (
        <Button
          onClick={responseImg} // bezpośrednie wywołanie responseImg tutaj
          disabled={loadingBasic || loadingDetails || loadingFollowUp}
          text={'ANALIZUJ'}
        />
      )}

      <div className={styles.responseContainer}>
        <div className={styles.buttonBox}></div>

        {loadingBasic ? (
          <div className={styles.spinner}>Loading...</div>
        ) : (
          basicResponse &&
          !followUpResponse && !detailResponse && (
            <div>
              <div className={styles.response}>{basicResponse} </div>
            </div>
          )
        )}

        {showDetails && !followUpResponse && (
          <>
            {loadingDetails ? (
              <div className={styles.spinner}>Loading...</div>
            ) : (
              detailResponse &&
              !followUpResponse && (
                <div>
                  <div className={styles.response}>{detailResponse} </div>
                </div>
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
          <div>
            <div className={styles.response}>{followUpResponse} </div>
          </div>
        )}

        <div className={styles.buttonBox}>
          {!showDetails && basicResponse && (
            <Button
              onClick={() => setShowDetails(true)}
              disabled={loadingDetails || loadingBasic}
              text={loadingDetails ? 'Analizuję...' : 'Szczegóły'}
            />
          )}
          {basicResponse && (
            <Button text={'Skanuj następne'} onClick={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
};
