'use client';
import React, { useState } from 'react';
import styles from './MainScreen.module.scss';
import Header from '../Header/Header';
import ScanButton from '../ScanButton/ScanButton';
import { motion, AnimatePresence } from 'framer-motion';

const MainScreen = () => {
  const [open, setOpen] = useState<boolean>(false);

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
          <div className={styles.intro_txt}>
            <div className={styles.dot}></div>
            <p>Wykonaj zdjęcie etykiety, ukazujące pełen skład produktu.</p>
          </div>
          <div className={styles.intro_txt}>
            <div className={styles.dot}></div>
            <p>Wykonaj zdjęcie etykiety, ukazujące pełen skład produktu.</p>
          </div>
          <div className={styles.intro_txt}>
            <div className={styles.dot}></div>
            <p>Upewnij się, że tekst jest czytelny, a zdjęcie ostre.</p>
          </div>
        </div>
        <ScanButton onClick={() => setOpen(!open)} />
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
              <div className={styles.scan_close} onClick={() => setOpen(!open)}>
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
