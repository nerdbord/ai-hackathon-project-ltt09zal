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
      {/*       <div className={styles.imageSmall} onClick={toggleMenu}> */}
      <div className={styles.imageSmall}>
        <Image src={'/assets/logo.png'} width={300} height={112} alt="Logo" />
      </div>
      {/* {isActive && (
        <div className={styles.menuBackground}>
          <div className={styles.menu}>
            <ul>
              <li>item1</li>
              <li>item2</li>
              <li>item3</li>
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;
