import React from 'react';
import styles from './MainScreen.module.scss';

const MainScreen = () => {
  return (
    <div className={styles.wrapper}>
       <div className={styles.container}>
       <div className={styles.intro}>
        <p><strong>Przygotuj swój produkt:</strong></p>
        <p>1. Zrób wyraźne zdjęcie etykiety ze składem.</p>
        <p>2. Sprawdź, czy cały tekst jest czytelny i zdjęcie nie jest rozmyte.</p> 
        <p>3. Zadbaj o oświetlenie do zdjęcia.</p>
        </div>
      <div className={styles.cameraImage}>
        <img src="/assets/camera.png" alt="camera" />
        </div>
        </div>
        <div>
        <button className={styles.button}>
          Skanuj produkt
          </button>
       </div>
    </div>
  
  )
}

export default MainScreen