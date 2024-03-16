import React from 'react';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.image}>
        <img src="/assets/HC_logo.png" alt="Logo" />
      </div>
    </div>
  );
};

export default Header;
