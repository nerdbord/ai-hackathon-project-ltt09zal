import { useStore } from '@/store/useStore';
import { useState } from 'react';
import Button from '../Button/Button';
import Spinner from '../Spinner/Spinner';
import styles from './Call.module.scss';

export const Call = () => {
  const [input, setInput] = useState<string>('');

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
    basicResponse,
    setBasicResponse,
    setDetailResponse,
    setFollowUpResponse,
    detailResponse,
    followUpResponse,
    setInitCamera,
    setBase64img,
    isCameraOpen,
    setIsCameraOpen,
  } = useStore();

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

  // const ingredients =
  //   'Składniki: olej rzepakowy, żółtko jaja 6,0%, ocet, musztarda (woda, gorczyca, ocet, sól, cukier, przyprawy, aromat), cukier, sól, przyprawy, przeciwutleniacz (E385), regulator kwasowości (kwas cytrynowy).';
  const ingredients = textOcr;

  const GetOcrText = () => {
    0;
    setStartOcr(!startOcr);
    setOpen(true);
  };

  const handleBasicIngredientsSubmit = () => {
    const basicPrompt = `spróbuj wyodrębnić z tego tekstu skład produktu spożywczego: ${ingredients}. A teraz Jesteś asystentem ds. zakupów, napisz mi coś krótko na temat tego składu, czy jest ok, czy ograniczać, czy jest zdrowy. dwa - trzy krótkie zdania, nie rozpisuj się.`;
    fetchGPTResponse(basicPrompt, setBasicResponse, setLoadingBasic);
  };

  const handleDetailIngredientsSubmit = () => {
    const detailPrompt = `spróbuj wyodrębnić z tego tekstu skład produktu spożywczego: ${ingredients}. A teraz jako asystent do spraw zakupów podaj mi szczegóły na temat tego składu, składników, najważniejsze dla mojego zdrowia itd. napisz około 300 znaków ${ingredients}`;
    fetchGPTResponse(detailPrompt, setDetailResponse, setLoadingDetails);
  };

  const handleFollowUpQuestionSubmit = () => {

      const followUpPrompt = `Biorąc pod uwagę poprzednie szczegółowe informacje na temat produktu: ${detailResponse}. Użytkownik pyta: "${input}". Proszę udzielić odpowiedzi.`;
      fetchGPTResponse(followUpPrompt, setFollowUpResponse, setLoadingFollowUp);    
  };

  const testowo = () => {
    handleBasicIngredientsSubmit();
    handleDetailIngredientsSubmit();
  };

  const resetCamera = () => {
    setTextOcr('');
    setBase64img('');
    setInitCamera(true);
    setIsCameraOpen(true);
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
    resetCamera();
  };

  return (
    <div className={styles.container}>
      <div className={styles.responseContainer}>
        <div className={styles.buttonBox}>
          <Button
            onClick={GetOcrText}
            text={textOcr === '' ? 'ZRÓB ZDJĘCIE' : 'POWTÓRZ'}
          />
          <Button
            onClick={testowo}
            text={'WYŚLIJ'}
            hidden={textOcr === '' ? true : false}
          />
        </div>
        {loadingBasic ? (
          <Spinner />
        ) : (
          basicResponse &&
          !showDetails &&
          !followUpResponse && (
            <div>
              <div className={styles.response}>{basicResponse} </div>
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
                  <div className={styles.response}>{detailResponse} </div>
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
      {followUpResponse && (
              <div className={styles.response}>{followUpResponse}</div>
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
