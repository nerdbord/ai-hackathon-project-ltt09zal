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
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (showContent) {
    return (
      <div className={styles.main_wrapper}>
        <Header />
        <MainScreen />
      </div>
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
        src="/assets/apple1.png"
        className={styles.appleIcon1}
        alt="Apple"
      />
      <motion.img
        src="/assets/apple1.png"
        className={styles.appleIcon2}
        alt="Apple"
      />
      <motion.img
        src="/assets/banana1.png"
        className={styles.bananaIcon1}
        alt="banana"
      />
      <motion.img
        src="/assets/banana1.png"
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
        src="/assets/git.gif"
        style={{ width: '400px', height: '200px' }}
        className={styles.logo}
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 2, duration: 1.9 }}
        alt="Logo"
      />
    </motion.div>
  );
};

export default WelcomeScreen;
