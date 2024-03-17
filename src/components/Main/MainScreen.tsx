'use client';
import React, { useState, useEffect } from 'react';
import styles from './MainScreen.module.scss';
import ScanButton from '../ScanButton/ScanButton';
import { motion, AnimatePresence } from 'framer-motion';
// import CapturePhoto from '../CapturePhoto/CapturePhoto';
import { useStore } from '@/store/useStore';
import { Call } from '../Call/Call';
import Close from '../icons/Close';
import Button from '../Button/Button';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MainScreen = () => {
  const {
    open,
    setOpen,
    startOcr,
    setStartOcr,
    textOcr,
    setInitCamera,
    initCamera, imageUrl, basicResponse
  } = useStore();

  // const GetOcrText = () => {
  //   setStartOcr(!startOcr);
  //   setOpen(true);
  // };

  const handleOpenScan = () => {
    setInitCamera(true);
    setOpen(true);
  };

  const handleCloseScan = () => {
    setInitCamera(false);
    setOpen(false);
  };
  // useEffect(() => {
  // }, [imageUrl]);
  return (
    <main className={styles.wrapper}>
      {!open && (
        <div className={styles.container}>
          <div className={styles.intro}>
            <h2>
              <strong>
                Jak skanować dla lepszych wyników{' '}
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
                <p>Zadbaj o oświetlenie do zdjęcia.</p>
              </div>
            </div>
          </div>
<PhotoUpload />
          {/* <ScanButton onClick={handleOpenScan} text={'Skanuj produkt'} /> */}
          {/* <button onClick={handleOpenScan}>huj</button> */}
        </div>
      )}

      <motion.div
        animate={
          open
            ? { opacity: 0.6, zIndex: 3 }
            : { opacity: 0, visibility: 'hidden' }
        }
        initial={{ opacity: 0 }}
        className={styles.bottomSheet}
        // onClick={() => setOpen(!open)}
      />
    {imageUrl !== '' && !basicResponse &&  <img className={styles.preview} src={imageUrl} alt='siema'/>}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { y: 0, height: 'auto' },
              collapsed: { y: '100%', height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className={styles.bottomSheet_container}
          >
            <div className={styles.bottomSheet_content}>
              <Call />
              <Button
                onClick={handleCloseScan}
                text={'Anuluj'}
                icon={<Close />}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MainScreen;
