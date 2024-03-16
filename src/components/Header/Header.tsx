import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <Image src="/assets/logo.png" alt="Logo" width={100} height={100} />
      </div>
      <p className={styles.title}>zdrowe info</p>
    </div>
  );
};

export default Header;
