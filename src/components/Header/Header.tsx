import React, { useState } from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import { useStore } from '@/store/useStore';

export const Header = () => {
  const { open } = useStore();
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };
  return (
    <div className={styles.wrapper}>
      <p className={styles.headerText}>
        ZDROWE<span className={styles.accent}>.</span>INFO
      </p>
      <div className={styles.imageSmall} onClick={toggleMenu}>
        <Image
          src={'/assets/HC_logo.png'}
          width={180}
          height={180}
          alt="Logo"
        />
      </div>
      {isActive && (
        <div className={styles.menuBackground}>
          <div className={styles.menu}>
            <ul>
              <li>item1</li>
              <li>item2</li>
              <li>item3</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
