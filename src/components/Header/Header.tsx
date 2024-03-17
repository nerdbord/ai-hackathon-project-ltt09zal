import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import { useStore } from '@/store/useStore';

export const Header = () => {
  const { open } = useStore();
  return (
    <div className={styles.wrapper}>
      <p className={open ? styles.headerText : styles.hidden}>
        DAJEMY TU JAKIŚ TEKST MORDECZKI?
      </p>
      <div className={open ? styles.imageSmall : styles.image}>
        <Image
          src={'/assets/HC_logo.png'}
          width={180}
          height={180}
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default Header;
