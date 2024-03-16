import React from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
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
