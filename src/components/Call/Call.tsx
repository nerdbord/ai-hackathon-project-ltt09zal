'use client'
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Call.module.scss';
import { useStore } from '@/store/useStore';
import Button from '../Button/Button';
import OpenAI from 'openai';
import PhotoUpload from '../PhotoUpload/PhotoUpload';
export const Call = () => {
  const [input, setInput] = useState<string>('');
  const [basicResponse, setBasicResponse] = useState<string>('');
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
    setImageUrl
  } = useStore();

  // const openai = new OpenAI({
  //   apiKey: process.env.NEXT_PUBLIC_VISION_KEY,
  // });

  // const responseImg = useCallback(async () => {
  //   try {
  //     const response = await openai.chat.completions.create({
  //       model: 'gpt-4-vision-preview',
  //       messages: [
  //         {
  //           role: 'user',
  //           content: 'co jest na tym obrazku ?',
  //         },
  //         {
  //           role: 'system',
  //           content: imageUrl,
  //         },
  //       ],
  //     });
  //     console.log(response.choices[0]);
  //   } catch (error) {
  //     console.error('Error calling OpenAI:', error);
  //   }
  // }, [imageUrl]);

  // const handleSendClick = () => {
  //   responseImg();
  // };

  const fetchGPTResponse = async (
    prompt: string,
    setResponseFunction: Function,
    setLoadingFunction: Function
  ) => {
    setLoadingFunction(true);
    try {
      if (!textOcr) {
        setResponseFunction('Musisz dodać zdjęcie zanim zatwierdzisz.');
        setLoadingFunction(false);
        return;
      }

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
      setResponseFunction('Wystąpił błąd podczas pobierania odpowiedzi.');
    }
    setLoadingFunction(false);
  };


  const responseImg = useCallback(async () => {
    console.log(imageUrl)
    try {
      const response = await fetch('/api/vision-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imageUrl,
        }),
      });
      const data = await response.json();
      console.log(data.text);
      setTextOcr(data.text);
      testowo();
    } catch (error) {
      console.error('Error calling OpenAI:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  // const ingredients = textOcr;
  const ingredients =
    'olej rzepakowy, żółtko jaja 6%, ocet, musztarda (woda, gorczyca, ocet, sól, cukier, przyprawy, aromat), cukier, sól, przyprawy, przeciwutleniacz (sól wapniowo-disodowa EDTA), regulator kwasowości (kwas cytrynowy).';

  const GetOcrText = () => {
    setStartOcr(!startOcr);
    setOpen(true);
  };

  const handleBasicIngredientsSubmit = () => {
    const basicPrompt = `Z poniższego tekstu spróbuj wyodrębnić skład: ${ingredients}. A teraz jako asystent ds. zakupów, napisz mi coś krótko na temat tego składu, czy jest zdrowy, czy mam go ograniczać, czy jest c. dwa krótkie zdania od asystenta, nie rozpisuj się. wyodrębnij skład z tego tekstu: ${ingredients}`;
    fetchGPTResponse(basicPrompt, setBasicResponse, setLoadingBasic);
  };

  const handleDetailIngredientsSubmit = () => {
    const detailPrompt = `Odszyfruj i wyodrębnij skład produktu spożywczego z tego tekst: ${ingredients}. A teraz jako asystent do spraw zakupów podaj mi szczegóły na temat tego składu najważniejsze dla mojego zdrowia. napisz około 400 znaków ${ingredients}`;
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
      {/* <Button
        onClick={responseImg}
        text={textOcr === '' ? 'ZDJĘCIE' : 'NOWE'}
      /> */}
      {/* <PhotoUpload /> */}

      <Button
        onClick={responseImg}
        disabled={loadingBasic || loadingDetails || loadingFollowUp}
        text={'ZATWIERDŹ'}
      />

      <div className={styles.responseContainer}>

        <div className={styles.buttonBox}>
          <PhotoUpload
            // onClick={GetOcrText}
            // text={textOcr === '' ? 'ZDJĘCIE' : 'NOWE'}
          />
          <Button onClick={testowo} text={'ZATWIERDŹ'} />
        </div>

        {loadingBasic ? (
          <div className={styles.spinner}>Loading...</div>
        ) : (
          basicResponse &&
          !followUpResponse && (
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
