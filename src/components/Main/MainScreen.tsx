'use client';
import React, { useState, useEffect } from 'react';
import styles from './MainScreen.module.scss';
import Header from '../Header/Header';
import ScanButton from '../ScanButton/ScanButton';
import { motion, AnimatePresence } from 'framer-motion';
import CapturePhoto from '../CapturePhoto/CapturePhoto';
import { useStore } from '@/store/useStore';
import { Call } from '../Call/Call';

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
    initCamera,
  } = useStore();

  const GetOcrText = () => {
    setStartOcr(!startOcr);
    setOpen(true);
  };

  const handleOpenScan = () => {
    setInitCamera(true);
    setOpen(true);
  };

  const handleCloseScan = () => {
    setInitCamera(false);
    setOpen(false);
  };

  return (
    <main className={styles.wrapper}>
      {!open && (
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

          <ScanButton onClick={handleOpenScan} text={'Skanuj produkt'} />
        </div>
      )}

      <motion.div
        animate={
          open
            ? { opacity: 0.6, zIndex: 3 }
            : { opacity: 0, visibility: 'hidden' }
        }
        initial={{ opacity: 0 }}
        className={styles.scan_box}
        // onClick={() => setOpen(!open)}
      />
      <CapturePhoto />
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
              <div className={styles.scan_close} onClick={handleCloseScan}>
                close
              </div>
              <div className={styles.scan_list}>
                <button onClick={GetOcrText}>
                  {textOcr === '' ? 'ZDJĘCIE' : 'NOWE'}
                </button>
                <Call />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MainScreen;
