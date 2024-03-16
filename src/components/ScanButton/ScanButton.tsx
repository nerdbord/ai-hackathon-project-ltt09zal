import React, { FC } from 'react';
import styles from './ScanButton.module.scss';

interface ScanButtonProps {
  onClick: () => void;
}

const ScanButton: FC<ScanButtonProps> = ({ onClick }) => {
  return (
    <div>
      <button className={styles.button} onClick={onClick}>
        Skanuj produkt
      </button>
    </div>
  );
};

export default ScanButton;
