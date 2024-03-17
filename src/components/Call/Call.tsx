import React, { useEffect, useState } from 'react';
import styles from './Call.module.scss';
import { useStore } from '@/store/useStore';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';

export const Call = () => {
  const [input, setInput] = useState<string>('');
  const [basicResponse, setBasicResponse] = useState<string>('');
  const [detailResponse, setDetailResponse] = useState<string>('');
  const [followUpResponse, setFollowUpResponse] = useState<string>('');
  const [loadingBasic, setLoadingBasic] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [loadingFollowUp, setLoadingFollowUp] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const {
    initCamera,
    startOcr,
    textOcr,
    setTextOcr,
    setStartOcr,
    setOpen,
    open,
  } = useStore();
  // const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  // const [selectedVoice, setSelectedVoice] =
  //   useState<SpeechSynthesisVoice | null>(null);

  // useEffect(() => {
  //   const voiceOptions = speechSynthesis.getVoices();
  //   setVoices(voiceOptions);
  //   setSelectedVoice(
  //     voiceOptions.find((voice) => voice.lang.startsWith('en')) || null
  //   );
  // }, []);

  // const speak = (text: string) => {
  //   if (text && speechSynthesis) {
  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.voice = selectedVoice || voices[0];
  //     speechSynthesis.speak(utterance);
  //   }
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

  const ingredients = textOcr;

  const GetOcrText = () => {
    setStartOcr(!startOcr);
    setOpen(true);
  };

  const handleBasicIngredientsSubmit = () => {
    const basicPrompt = `Odszyfruj i wyodrębnij skład produktu spożywczego z tego tekst: ${ingredients}. A teraz Jesteś asystentem ds. zakupów, napisz mi coś krótko na temat tego składu, czy jest ok, czy ograniczać, czy jest zdrowy. dwa krótkie zdania od asystenta, nie rozpisuj się. wyodrębnij skład z tego tekstu: ${ingredients}`;
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
    <div className={styles.container}>
      <div className={styles.responseContainer}>
        <div className={styles.buttonBox}>
          <Button
            onClick={GetOcrText}
            text={textOcr === '' ? 'ZDJĘCIE' : 'NOWE'}
          />
         {textOcr && <Button onClick={testowo} text={'ZATWIERDŹ'} />} 
        </div>
        {loadingBasic ? (
          <Spinner />
        ) : (
          basicResponse &&
          !followUpResponse && (
            <div>
              <div className={styles.response}>
                {basicResponse}{' '}
                {/* <button onClick={() => speak(basicResponse)}>
             Czytaj podstawową odpowiedź
           </button> */}
              </div>
            </div>
          )
        )}

        {showDetails && !followUpResponse && (
          <>
            {loadingDetails ? (
              <Spinner />
            ) : (
              detailResponse &&
              !followUpResponse && (
                <div>
                  <div className={styles.response}>
                    {detailResponse}{' '}
                    {/* <button onClick={() => speak(detailResponse)}>
                      Czytaj szczegółową odpowiedź
                    </button> */}
                  </div>
                </div>
              )
            )}
            <div className={styles.details}>
              <textarea
                placeholder="Dopytaj o szczegóły"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loadingFollowUp}
              />
              <Button
                text={'Wyślij'}
                onClick={handleFollowUpQuestionSubmit}
                disabled={loadingFollowUp || !input}
              />
            </div>
          </>
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
