import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import MainScreen from '../Main/MainScreen';
import { motion } from 'framer-motion';
import styles from './WelcomeScreen.module.scss';

const WelcomeScreen = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showContent) {
    return (
      <>
      <Header />
        <MainScreen />
      </>
    );
  }
  return (
    <motion.div
      className={styles.animationContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src="/assets/apple.png"
        className={styles.appleIcon1}
        alt="Apple"
      />
      <motion.img
        src="/assets/apple.png"
        className={styles.appleIcon2}
        alt="Apple"
      />
      <motion.img
        src="/assets/banana.png"
        className={styles.bananaIcon1}
        alt="banana"
      />
      <motion.img
        src="/assets/banana.png"
        className={styles.bananaIcon2}
        alt="banana"
      />
      <motion.img
        src="/assets/broccoli.png"
        className={styles.broccoliIcon1}
        alt="broccoli"
      />
      <motion.img
        src="/assets/broccoli.png"
        className={styles.broccoliIcon2}
        alt="broccoli"
      />
      <motion.img
        src="/assets/logo.png"
        className={styles.logo}
        alt="Logo Zdrowe Info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
      />
    </motion.div>
  );
};

export default WelcomeScreen;
