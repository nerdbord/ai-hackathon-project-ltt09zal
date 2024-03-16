'use client';
import React, { useState, useEffect } from 'react';
import styles from './MainScreen.module.scss';
import Header from '../Header/Header';
import ScanButton from '../ScanButton/ScanButton';
import { motion, AnimatePresence } from 'framer-motion';
import CapturePhoto from '../CapturePhoto/CapturePhoto';

const MainScreen = () => {
  const [open, setOpen] = useState<boolean>(false);
  // For camera and ocr handling:
  const [resetOcr, setResetOcr] = useState<boolean>(false);
  const [takePhoto, setTakePhoto] = useState<boolean>(false);
  const [photoReady, setPhotoReady] = useState<boolean>(false);
  const [getText, setGetText] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    photoReady && setGetText(true);
  }, [photoReady]);

  useEffect(() => {
    text !== '' && setOpen(true);
  }, [text]);

  const handleResetOcr = () => {
    setResetOcr(!resetOcr);
    setTakePhoto(false);
    setGetText(false);
    setText('');
    setOpen(false);
  };

  return (
    <main className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.intro}>
          <h2>
            <strong>
              Jak osiągnąć najlepsze efekty{' '}
              <span className={styles.intro_span}>?</span>
            </strong>
          </h2>
          <div className={styles.stepsWrapper}>
            <div className={styles.intro_txt}>
              <div className={styles.dot}></div>
              <p>Wykonaj zdjęcie etykiety, ukazujące pełen skład produktu.</p>
            </div>
            <div className={styles.intro_txt}>
              <div className={styles.dot}></div>
              <p>Upewnij się, że tekst jest czytelny, a zdjęcie ostre.</p>
            </div>
            <div className={styles.intro_txt}>
              <div className={styles.dot}></div>
              <p>Wykonaj zdjęcie etykiety, ukazujące pełen skład produktu.</p>
            </div>
          </div>
        </div>
        <CapturePhoto
          takePhoto={takePhoto}
          setPhotoReady={setPhotoReady}
          getText={getText}
          setText={setText}
          resetOcr={resetOcr}
        />
        <ScanButton
          onClick={() => (text === '' ? setTakePhoto(true) : handleResetOcr())}
          text={text === '' ? 'Skanuj produkt' : 'Skanuj nowy'}
          disabled={takePhoto && text === ''}
        />
      </div>
      <motion.div
        animate={
          open
            ? { opacity: 0.6, zIndex: 3 }
            : { opacity: 0, visibility: 'hidden' }
        }
        initial={{ opacity: 0 }}
        className={styles.scan_box}
        onClick={() => setOpen(!open)}
      />
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { y: 0, height: 'auto', opacity: 1 },
              collapsed: { y: '100%', height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className={styles.scan_container}
          >
            <div className={styles.scan_content}>
              <div className={styles.scan_close} onClick={() => setOpen(false)}>
                close
              </div>
              <div className={styles.scan_list}>
                <span>item 1</span>
                <span>item 2</span>
                <span>item 3</span>
                <span>item 4</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MainScreen;
